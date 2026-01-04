export type Product = {
  id: string
  title: string
  price: number
  length: string
  texture: string
  lace: string
  imageUrl: string
  description: string
}

export const productsSeed: Product[] = [
  {
    id: "hd-bodywave-24",
    title: "HD Lace Body Wave Wig",
    price: 189,
    length: "24 inch",
    texture: "Body Wave",
    lace: "HD Lace",
    imageUrl:
      "https://images.unsplash.com/photo-1520975693411-b7596a2a42f5?auto=format&fit=crop&w=1200&q=80",
    description: "Soft, natural body wave with HD lace for a seamless melt.",
  },
  {
    id: "transparent-straight-20",
    title: "Transparent Lace Straight Wig",
    price: 159,
    length: "20 inch",
    texture: "Straight",
    lace: "Transparent Lace",
    imageUrl:
      "https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&w=1200&q=80",
    description: "Sleek straight look with transparent lace—perfect everyday unit.",
  },
  {
    id: "curly-13x4-18",
    title: "13x4 Deep Curly Wig",
    price: 175,
    length: "18 inch",
    texture: "Deep Curly",
    lace: "13x4",
    imageUrl:
      "https://images.unsplash.com/photo-1520975869010-0f42b68a9d3c?auto=format&fit=crop&w=1200&q=80",
    description: "Defined curls with a roomy 13x4 parting space.",
  },
]
