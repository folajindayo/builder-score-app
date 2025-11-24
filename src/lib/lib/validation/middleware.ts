/**
 * Validation middleware for API routes
 */

import { ZodSchema } from "zod";
import { validateOrThrow } from "./validators";
import { NextRequest, NextResponse } from "next/server";

export interface ValidationOptions {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export function withValidation(options: ValidationOptions) {
  return async (req: NextRequest, handler: (req: NextRequest) => Promise<NextResponse>) => {
    try {
      // Validate body
      if (options.body) {
        const bodyText = await req.text();
        const body = bodyText ? JSON.parse(bodyText) : {};
        
        try {
          validateOrThrow(options.body, body);
        } catch (error: any) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "VALIDATION_ERROR",
                message: "Invalid request body",
                details: error.errors || {},
              },
            },
            { status: 400 }
          );
        }
      }

      // Validate query parameters
      if (options.query) {
        const { searchParams } = new URL(req.url);
        const query = Object.fromEntries(searchParams.entries());
        
        try {
          validateOrThrow(options.query, query);
        } catch (error: any) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "VALIDATION_ERROR",
                message: "Invalid query parameters",
                details: error.errors || {},
              },
            },
            { status: 400 }
          );
        }
      }

      // Call the handler
      return await handler(req);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INTERNAL_ERROR",
            message: "Internal server error",
          },
        },
        { status: 500 }
      );
    }
  };
}

export function validateBody<T>(schema: ZodSchema<T>) {
  return async (data: unknown): Promise<T> => {
    return validateOrThrow(schema, data);
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return (data: unknown): T => {
    return validateOrThrow(schema, data);
  };
}

