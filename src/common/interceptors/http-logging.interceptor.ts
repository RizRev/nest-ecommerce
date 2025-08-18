import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

type Json = Record<string, any>;

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  // field yang akan disensor (case-insensitive)
  private readonly redactKeys = [
    'password',
    'pass',
    'token',
    'authorization',
    'secret',
    'apiKey',
  ];
  private readonly maxLen = 1000; // maksimal panjang stringified agar log nggak meledak

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest();
    const res = http.getResponse();

    const start = Date.now();
    const method = req.method;
    const url = req.originalUrl ?? req.url;
    const className = context.getClass().name;
    const handler = context.getHandler().name;

    // snapshot request
    const reqInfo = {
      params: this.safeJson(req.params),
      query: this.safeJson(req.query),
      body: this.safeJson(req.body),
      headers: this.pickHeaders(req.headers, ['x-request-id']), // contoh: ambil header tertentu bila perlu
    };

    // bungkus response supaya kita bisa log “data” tanpa mengganggu alirannya
    return next.handle().pipe(
      map((data) => {
        // simpan sementara untuk logging, tapi tetap teruskan data ke client
        (res as any).__respBodyForLog = data;
        return data;
      }),
      tap(() => {
        const ms = Date.now() - start;
        const status = res.statusCode;

        // ambil body response yang sudah kita tangkap di atas
        const respBody = this.safeJson((res as any).__respBodyForLog);

        // format akhir
        this.logger.log(
          [
            `${method} ${url} ${status} - ${ms}ms | ${className}.${handler}`,
            `req.params=${reqInfo.params}`,
            `req.query=${reqInfo.query}`,
            `req.body=${reqInfo.body}`,
            `res.body=${respBody}`,
          ].join(' | '),
        );
      }),
    );
  }

  private redact(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map((v) => this.redact(v));

    const lowered = this.redactKeys.map((k) => k.toLowerCase());
    const out: Json = {};
    for (const [k, v] of Object.entries(obj)) {
      if (lowered.includes(k.toLowerCase())) {
        out[k] = '[REDACTED]';
      } else if (v && typeof v === 'object') {
        out[k] = this.redact(v);
      } else {
        out[k] = v;
      }
    }
    return out;
  }

  private safeJson(value: any): string {
    try {
      // hindari log buffer/stream/file
      if (Buffer.isBuffer(value)) return '[Buffer]';
      if (
        value &&
        typeof value === 'object' &&
        typeof value.pipe === 'function'
      )
        return '[Stream]';

      const redacted = this.redact(value);
      let str = JSON.stringify(redacted);
      if (str.length > this.maxLen)
        str = str.slice(0, this.maxLen) + '…(truncated)';
      return str;
    } catch {
      return '[Unserializable]';
    }
  }

  private pickHeaders(headers: Record<string, any>, allow: string[]): Json {
    const out: Json = {};
    for (const k of allow) {
      if (headers?.[k]) out[k] = headers[k];
    }
    return out;
  }
}
