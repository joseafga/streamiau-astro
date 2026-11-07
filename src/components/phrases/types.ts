export type Category = {
  phrases: string[];
};

export type Categories = Record<string, Category>;

export type Phrases = {
  _id?: { $oid: string };
  username: string;
  categories: Categories;
};
