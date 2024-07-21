import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database";

interface LocationAttributes {
  id: number;
  original_id: number | null;
  name: string;
  type: string;
  dimension: string;
}

type LocationCreationAttributes = Optional<LocationAttributes, "id">;

class Location
  extends Model<LocationAttributes, LocationCreationAttributes>
  implements LocationAttributes
{
  public id!: number;
  public original_id!: number | null;
  public name!: string;
  public type!: string;
  public dimension!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Location.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    original_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
    },
    dimension: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "location",
    tableName: "location",
    timestamps: true,
  }
);

export default Location;
