export default class Client {
  private CLIPLISTER_HOST = 'https://api-rs.mycliplister.com/v2.2/apis/asset';
  token: string;

  constructor(token: string) {
    if (!token) {
      throw new Error('You must provide an Cliplister token!');
    }

    this.token = token;
  }

  public async search(value: string): Promise<CliplisterSearchResponse> {
    const res = await fetch(
      `${this.CLIPLISTER_HOST}/list?search=%7B%22filename%22:%22*${value}*%22%7D&include_amount=true&fiqlc=type%3D%3Dvideo,type%3D%3Dpicture&include_directories=true&status=free`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }
    );

    if (res.ok) {
      const data: CliplisterResponse = await res.json();
      return {
        error: false,
        photos: data.assets
      };
    }

    return {
      error: true,
      photos: []
    };
  }
}