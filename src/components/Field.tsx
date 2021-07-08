import React from 'react';
import { Paragraph, Button } from '@contentful/forma-36-react-components';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';

interface FieldProps {
  sdk: FieldExtensionSDK;
}

interface Props {
  sdk: FieldExtensionSDK;
}

interface State {
  value: CliplisterStored;
}

export default class Field extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      value: props.sdk.field.getValue() || null,
    };
  }

  detachExternalChangeHandler: Function | null = null;

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(this.onExternalChange);
  }

  componentWillUnmount() {
    if (this.detachExternalChangeHandler) {
      this.detachExternalChangeHandler();
    }
  }

  onExternalChange = (selectedPhoto: CliplisterResult) => {

    /*var photos = this.state.value;
    console.log("EXTERNAL CHANGE: ")
    photos?.assets.push(selectedPhoto);*/
    //this.setState({ value: photos });
  };

  openSearch = async () => {
    const selectedPhoto: CliplisterResult | null = await this.props.sdk.dialogs.openCurrentApp({
      title: 'Select a photo',
      minHeight: 800,
      width: 'large'
    });

    if (selectedPhoto) { 
      var photos = this.state.value;
      //var finalResult: CliplisterResult = {title: selectedPhoto.title, uuid: selectedPhoto.uuid, fileName: selectedPhoto.fileName, fileType: selectedPhoto.fileType, fileExt: selectedPhoto.fileExt, uniqueId: selectedPhoto.uniqueId};
      var finalResult: CliplisterResult = selectedPhoto;

      if(photos == null){
        console.log("PHOTOS NULL", photos);
        var empty: CliplisterStored = {assets:[]};
        empty.assets.push(finalResult);
        photos = empty;
      }else{
        photos.assets.push(finalResult);
      }
      this.props.sdk.field.setValue(photos);
      this.setState({ value: photos });
      console.log("NOW:", photos);
    }
  };

  removeAsset = (photo: CliplisterResult, position: number) =>{
    console.log(photo.uuid);
    var filtered = this.state.value;
    filtered.assets = filtered.assets.filter(function(el, pos) { return pos != position }); 
    console.log(filtered);
    this.props.sdk.field.setValue(filtered);
    this.setState({ value: filtered });
  }

  render() {
    const { value } = this.state;

    //@ts-ignore
    const parameters: AppInstallationParameters = this.props.sdk.parameters.installation;
    console.log("RENDER:", value)
    var position = 0;
    return (
      <div>
        <Button className="cliplisterButton" onClick={this.openSearch}>+ Add Cliplister Asset</Button>
        <div>
          {value != undefined && value.assets.map((photo, pos)=> {
            var backgroundImage = {backgroundImage: `url(${parameters.cliplisterSourceUrl+photo.uuid}?x=900)`}
            console.log("HELLO",photo.fileType);
            if(photo.fileType == "Video"){
              backgroundImage = {backgroundImage: ".img/icon-video.png"}
            }
            return(
              <div style={{backgroundImage: `url(${parameters.cliplisterSourceUrl+photo.uuid}?x=900)`}} title={photo.title} onClick={() => this.removeAsset(photo, pos)} className="cliplisterImagePreview" >
                {photo.fileType == "Video" &&
                  <svg className="Illustration__Illustration___1R5Px cliplisterVideoPreview" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"><path d="M20.5 23.5h-17V.5h11l6 6z"></path><path d="M14.5.5v6h6M8.5 8.5l8 5-8 5z"></path></g></svg>
                }
                <div className="cliplisterAssetTitle">
                  {photo.fileName}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    );
  };
}