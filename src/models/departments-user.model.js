import { DB_MODELS } from "../constants/db-models.constant";
import { ObjectIdType, generateSchema } from "../db/db.odm";

const departmentsUserSchemaPattern = {
  department: {
    type: ObjectIdType,
    ref: DB_MODELS?.DEPARTMENT,
  },
  user: {
    type: ObjectIdType,
    ref: DB_MODELS?.USER,
  },
};

const departmentsUserSchema = generateSchema(departmentsUserSchemaPattern);
export const DepartmentsUserModel = generateModel(
  DB_MODELS?.DEPARTMENTS_USER,
  departmentsUserSchema
);
