import type { RuleRender } from "antd/es/form";
import type { ZodType } from "zod";

export type AntdFormZodSchema = ZodType;

export const createZodSync =
  (schema: AntdFormZodSchema): RuleRender =>
  ({ getFieldsValue }) => ({
    validator: (rule) => {
      // AsyncValidator adds field - rc-field-form type isn't correct
      // https://github.com/search?q=repo%3Ayiminghe%2Fasync-validator%20fullField&type=code
      const { field } = rule as { field: string };
      const values = getFieldsValue();

      return schema.safeParseAsync(values).then((data) => {
        if (!data.success) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const error = data.error.issues.find((err: any) =>
            (err.path as PropertyKey[]).map(String).join(".") === field,
          );
          if (error) return Promise.reject(error);
        }
        return Promise.resolve(undefined);
      });
    },
  });
