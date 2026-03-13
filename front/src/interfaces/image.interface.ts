export interface Image {
  id: number;
  url: string;
  publicId: string;
  createdAt: Date;
  devilFruitId? : number | null;
  onePieceCharacterId? : number | null;
  arcId? : number | null;
}