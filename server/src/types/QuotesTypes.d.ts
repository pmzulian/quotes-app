/**
 * @interface QuoteInterface
 * @description Define la estructura de una fila en la tabla 'quotes' de la base de datos.
 */
export interface QuoteInterface {
  id: string; // Puede ser autoincremental, opcional
  description: string;
  author: string;
  favorite?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

/**
 * @interface NewQuoteInterface
 * @description Define la estructura de los datos para crear una nueva 'Quote'.
 * Aquí, el 'id' es opcional o no presente,
 * y los timestamps también, ya que la DB los generará.
 */
export interface NewQuoteInterface extends Omit<QuoteInterface, 'id' | 'created_at' | 'updated_at'> { }

/**
 * @interface UpdateQuoteInterface
 * @description Define la estructura de los datos para actualizar una 'Quote'.
 * Todas las propiedades son opcionales, ya que solo se actualizaran algunas.
 * 'id' no debe ser actualizable aquí.
 */
export interface UpdateQuoteInterface extends Partial<Omit<QuoteInterface, 'id' | 'created_at' | 'updated_at'>> { }

// Tipo para los nombres de las columnas para mayor seguridad
export type QuoteColumn = keyof QuoteInterface;
