export interface ArticleAdd {
  title: string;
  description: string;
  category_id: number;
  tags: Array<number>;
  content: any;
}