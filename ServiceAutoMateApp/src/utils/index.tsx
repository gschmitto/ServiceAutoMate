export const stringToFloat = (valor: string): number => {
  return parseFloat(valor.replace(',', '.'));
};