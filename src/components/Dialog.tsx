import React from 'react';
import { TextInput, Button, Asset } from '@contentful/forma-36-react-components';
import { DialogExtensionSDK } from 'contentful-ui-extensions-sdk';
import debounce from 'lodash.debounce';
import Client from './client';
import { AppInstallationParameters } from './ConfigScreen';
import { timingSafeEqual } from 'crypto';

interface Props {
  sdk: DialogExtensionSDK;
}

interface State {
  searchValue: string;
  client: Client;
  error: boolean;
  photos: CliplisterResult[];
}

export default class Dialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    //@ts-ignore
    const parameters: AppInstallationParameters = this.props.sdk.parameters.installation;

    // console.log("PARAMETERS", this.props.sdk.parameters.installation);
    //var parameters = this.props.sdk.parameters.installation;
    console.log("HERE:", parameters.cliplisterApiToken);
    this.state = {
      searchValue: '',
      client: new Client(parameters.cliplisterApiToken || ''),
      error: false,
      photos: [],
    };
  }

  componentDidMount() { 
    this.props.sdk.window.startAutoResizer();
    this.onSearch("");
  }
  formatPhotoThumb(uuid: string) {

    //@ts-ignore
    const parameters: AppInstallationParameters = this.props.sdk.parameters.installation;


    console.log("PARAMETERS", parameters.cliplisterSourceUrl);
    
    return parameters.cliplisterSourceUrl+uuid+"?x=300&quality=80";
    //return url.replace('fit=max', 'fit=fillmax').concat('&w=300&h=300');
  }


  onSearch = debounce(async (value: string) => {
    /*if (!value) {
      this.setState({ photos: [] });
      return;
    }*/

    const res = await this.state.client.search(value);

    this.setState({
      error: res.error,
      photos: res.photos
    });
  }, 300);

  save = (photo: CliplisterResult) => {
    this.props.sdk.close(photo);
  };

  render() {
    const { photos } = this.state;

    return (
      <div>
        <div>
          <TextInput
            width="full"
            type="text"
            id="my-field"
            testId="my-field"
            placeholder="Search for a photo"
            autoComplete="off"
            value={this.state.searchValue}
            onChange={(e:any) => this.onSearch(e.target.value)}
          />
        </div>
        <div className="search-collection">
          {photos.map((photo)=> {
            return(
                <div key={photo.uuid} onClick={() => this.save(photo)} className="photo">
                  {photo.fileType == "Video" &&
                    <Asset src={this.formatPhotoThumb(photo.uuid)} type="video" title={photo.title} />
                  }
                  {photo.fileType == "Picture" &&
                    <Asset src={this.formatPhotoThumb(photo.uuid)} type="image" title={photo.title} />
                  }
                </div>
            )
          })}
        </div>
      </div>
    );
  }
}