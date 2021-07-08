import React, { Component } from 'react';
import { AppExtensionSDK, ContentType } from 'contentful-ui-extensions-sdk';
import { Heading, Form, Workbench, Paragraph, TextInput} from '@contentful/forma-36-react-components';
import { css } from 'emotion';

export interface AppInstallationParameters {cliplisterApiToken: string, cliplisterSourceUrl: string }

interface ConfigProps {
  sdk: AppExtensionSDK;
}

interface ConfigState {
  parameters: AppInstallationParameters;
}

export default class Config extends Component<ConfigProps, ConfigState> {
  constructor(props: ConfigProps) {
    super(props);
    this.state = {
      parameters: {
        cliplisterApiToken: '',
        cliplisterSourceUrl: ''
      }
    };

    // `onConfigure` allows to configure a callback to be
    // invoked when a user attempts to install the app or update
    // its configuration.
    props.sdk.app.onConfigure(() => this.onConfigure());
  }

  async componentDidMount() {
    // Get current parameters of the app.
    // If the app is not installed yet, `parameters` will be `null`.
    const parameters: AppInstallationParameters | null = await this.props.sdk.app.getParameters();

    const {app, space} = this.props.sdk;
    app.onConfigure(this.onConfigure);

    const [ctsRes] = await Promise.all([
      space.getContentTypes<ContentType>()
    ])


    this.setState(parameters ? { parameters } : this.state, () => {
      // Once preparation has finished, call `setReady` to hide
      // the loading screen and present the app to a user.
      this.props.sdk.app.setReady();
    });
  }

  onConfigure = async () => {
    // This method will be called when a user clicks on "Install"
    // or "Save" in the configuration screen.
    // for more details see https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#register-an-app-configuration-hook

    return {
      // Parameters to be persisted as the app configuration.
      parameters: this.state.parameters
    };
  };
  changeToken = (cliplisterApiToken = '') => {
    this.setState({parameters: {... this.state.parameters, cliplisterApiToken}});
  }
  changeUrl = (cliplisterSourceUrl = '') => {
    this.setState({parameters: {... this.state.parameters, cliplisterSourceUrl}});
  }

  render() {
    return (
      <Workbench className={css({ margin: '80px' })}>
        <Form>
          <Heading>Cliplister Contentful Integration</Heading>
          <Paragraph>Please enter your token to access our REST API</Paragraph>
          <TextInput placeholder="Rest API Token" value={this.state.parameters.cliplisterApiToken} onChange={(e:any) => this.changeToken(e.target.value)}></TextInput>
          <TextInput placeholder="Custom Domain" value={this.state.parameters.cliplisterSourceUrl} onChange={(e:any) => this.changeUrl(e.target.value)}></TextInput>
        </Form>
      </Workbench>
    );
  }
}
