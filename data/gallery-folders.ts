export interface FolderMedia {
  id: number;
  type: "image" | "video";
  src: string;
  caption: string;
}

export interface GalleryFolder {
  id: string;
  name: string;
  cover: string;
  date: string;
  items: FolderMedia[];
}

export const galleryFolders: GalleryFolder[] = [
  {
    id: "kalinchowk",
    name: "Kalinchowk",
    cover: "https://lh3.googleusercontent.com/pw/AP1GczPc-yJ_W1Fs-eXXLvytU7DrStUkRbExvD42StC4IUNXRSb2tAmXTyfxoHeMbKevP8mR9Cu3kbV0jToQAlCPVfNqzo5BrwtULYS4ksZH0nm5L6YKgXI=s800",
    date: "November 2024",
    items: [
      {
        id: 1,
        type: "image",
        src: "https://lh3.googleusercontent.com/pw/AP1GczPc-yJ_W1Fs-eXXLvytU7DrStUkRbExvD42StC4IUNXRSb2tAmXTyfxoHeMbKevP8mR9Cu3kbV0jToQAlCPVfNqzo5BrwtULYS4ksZH0nm5L6YKgXI=d",
        caption: "Mountain view",
      },
      {
        id: 2,
        type: "image",
        src: "https://lh3.googleusercontent.com/pw/AP1GczNBqD-To3_2ho5npWI7cnXrmHMTijZg6cKWnQxLuaF2jZe--lYrLQ-Vsx010PAt_6dH6Kja-_eKLVAne1p0QbK8zLdj5bvd0kcq_9pVaQ-eQ0hobSQ=d",
        caption: "Landscape",
      },
      {
        id: 3,
        type: "image",
        src: "https://lh3.googleusercontent.com/pw/AP1GczPB9UF4pZphSrTLBytkHqAwWUCJc4yPYoC51JOaLbR0qAOZmdYrk096XfjM4qv1y9Vz2f2X6aoBZS64hKVRdrs6DpU9fAu3ByF7Xje63lXqan4noew=d",
        caption: "Scenic view",
      },
      {
        id: 4,
        type: "image",
        src: "https://lh3.googleusercontent.com/pw/AP1GczPTSQ_hfWWZXCDy3TlH9Dvzf0DZBDR1twZbJljN9rcMHn9SAOVA0zRlZQVZGCubnOVaSYicZKSaADU2tf6e3CEenEQ4K1J7VZ-w9b6f_Q3f0DTJjWM=d",
        caption: "Peak view",
      },
      {
        id: 5,
        type: "image",
        src: "https://lh3.googleusercontent.com/pw/AP1GczOeCducobtOE7ORqEgzdbAey3eJClhYhpiDRSXInG3esG0TKr3UvsC85j1J2AjZaTKnIwDNlVDIQ1-gomRlZsmxKjVcfBYIRj6umQJrc9YfE2wmFWI=d",
        caption: "Nature",
      },
      {
        id: 6,
        type: "image",
        src: "https://lh3.googleusercontent.com/pw/AP1GczP4s-Wo3QAAEb2SvqudA9nSbepHqRaICVAJFQfEdhQGs137V-ul0CQUNl0UMQvfy1S7HkpRBaGPQ0pq8Yt7dt12MLR0skZv71Nhye-LO9ubEbHJPRU=d",
        caption: "Trail",
      },
      {
        id: 7,
        type: "image",
        src: "https://lh3.googleusercontent.com/pw/AP1GczNvxDBE-YqXD7SferkjpcJ9DZsuxTdHm7B9Q780na0qi05UbIRKCtTEH-gsHxGeni0VWYoexGZJK8Ad5q3ZXRNg6hJfhXq0FArUkLuT9IJy5Z2CDhQ=d",
        caption: "Panorama",
      },
      {
        id: 8,
        type: "image",
        src: "https://lh3.googleusercontent.com/pw/AP1GczOx_mpKXeEO8cOIvrNAmNYXZBF5PNmh4Q_Xxg4PIIKmabmkgFH-nbkiH6ToR5JmQpFmyPqm5DYshYr1NpuoqAbzJ58lmKv-BihoDoe8RDJyo56tmNI=d",
        caption: "Sunset",
      },
      {
        id: 9,
        type: "image",
        src: "https://lh3.googleusercontent.com/pw/AP1GczOXNJGED2xNvzzFGxFm8NSyvAHJLbq8TS7J_xjLkQzpYKSht-NUy9PepNU3ZjgOcjHkCvFQRblWD-WJXBmItytQNYkm55A6roniLGULDrZ9Tm4oJOw=d",
        caption: "Clouds",
      },
      {
        id: 10,
        type: "image",
        src: "https://lh3.googleusercontent.com/pw/AP1GczPHuQ1XvEf9bGrPgZc0STEkg8LtS1OL8G_ZYFJvQ8TBDuCdq8o11Kr2k9Q6JGKwtiQMZ8GZqmXS-dGDaEfJcNrtdkoWdEVOQwDIbaNkIFLRUOkyMKM=d",
        caption: "Summit",
      },
      {
        id: 11,
        type: "video",
        src: "https://video-downloads.googleusercontent.com/ADGPM2kBtWM-MIWeKvT-gkPCk_dAGLD0okxBt4caxwA1bU86MGCRmta3Q7v3lNi2RcrXQ002wnPImzemzt8yVTQ4cW0wW9hZACCUiHVZlNmWIhzt5D0cxmO-wv1iG6mAc6WMMhXdEFFIGgmaqEJLWjca9uUiv93ZXXGDJF5zyQGAH_sTyfRWqwqlJyRRLgMzaW_N7rr7yz0U56_DGkxUJ20Scfa42fMhlu_eA8d9SEZALVvN6bNzqZscMXLQ5kfidK3Ej74XovIW",
        caption: "Journey",
      },
    ],
  },
];
