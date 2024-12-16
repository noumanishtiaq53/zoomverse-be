import { DB_MODELS } from "../constants/db-models.constant";

const departmentSchemaPattern = {
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
  },
};

const departmentSchema = generateSchema(departmentSchemaPattern);

export const Department = generateModel(
  DB_MODELS?.DEPARTMENT,
  departmentSchema
);
