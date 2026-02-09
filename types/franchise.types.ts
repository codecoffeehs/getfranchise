export interface Franchise {
  id: string;
  brandName: string;
  website?: string;
  category: string;
  imageUrl: string;
}
export interface UserFranchiseResponse {
  result: Franchise[];
  totalPages: number;
}
