export interface SchemaField {
  k: string; // key
  n: string; // name
}

export interface SchemaCategory {
  category: string;
  fields: SchemaField[];
}

// Dynamic key signature for the stored data object
export interface DataEntry {
  id: number;
  date: string;
  [key: string]: any;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}