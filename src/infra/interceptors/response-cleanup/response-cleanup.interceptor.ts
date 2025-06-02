import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type CleanableValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | CleanableObject
  | CleanableArray;
type CleanableObject = { [key: string]: CleanableValue };
type CleanableArray = CleanableValue[];
type CleanedValue =
  | string
  | number
  | boolean
  | null
  | CleanedObject
  | CleanedArray;
type CleanedObject = { [key: string]: CleanedValue };
type CleanedArray = CleanedValue[];

@Injectable()
export class ResponseCleanupInterceptor
  implements NestInterceptor<CleanableValue, CleanedValue>
{
  intercept(
    _: ExecutionContext,
    next: CallHandler<CleanableValue>,
  ): Observable<CleanedValue> {
    return next
      .handle()
      .pipe(map((data: CleanableValue) => this.cleanupResponse(data)));
  }

  private cleanupResponse(data: CleanableValue): CleanedValue {
    if (data === null || data === undefined) {
      return null;
    }

    const dataType = this.getDataType(data);

    switch (dataType) {
      case 'primitive':
        return data as boolean | number;
      case 'string':
        return this.cleanupString(data as string);
      case 'array':
        return this.cleanupArray(data as CleanableArray);
      case 'object':
        return this.cleanupObject(data as CleanableObject);
      default:
        return data as CleanedValue;
    }
  }

  private getDataType(
    data: CleanableValue,
  ): 'primitive' | 'string' | 'array' | 'object' | null {
    switch (true) {
      case typeof data === 'boolean' || typeof data === 'number':
        return 'primitive';
      case typeof data === 'string':
        return 'string';
      case Array.isArray(data):
        return 'array';
      case typeof data === 'object':
        return 'object';
      default:
        return null;
    }
  }

  private cleanupString(data: string): CleanedValue {
    return data === '' ? null : data;
  }

  private cleanupArray(data: CleanableArray): CleanedValue {
    if (data.length === 0) {
      return null;
    }
    const cleanedArray: CleanedArray = data
      .map((item: CleanableValue) => this.cleanupResponse(item))
      .filter(
        (item: CleanedValue): item is NonNullable<CleanedValue> =>
          item !== null,
      );
    return cleanedArray.length === 0 ? null : cleanedArray;
  }

  private cleanupObject(data: CleanableObject): CleanedValue {
    const cleanedObject: CleanedObject = {};
    let hasValidProperties = false;

    for (const [key, value] of Object.entries(data)) {
      const cleanedValue = this.cleanupResponse(value);
      if (cleanedValue !== null) {
        cleanedObject[key] = cleanedValue;
        hasValidProperties = true;
      }
    }

    return hasValidProperties ? cleanedObject : null;
  }
}
