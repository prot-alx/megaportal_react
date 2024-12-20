import { RequestFilterParams } from "../types/request.types";

export const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
};

export const buildQueryString = (params: RequestFilterParams): string => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          query.append(key, String(item));
        });
      } else {
        query.append(key, String(value));
      }
    }
  });

  return query.toString();
};
