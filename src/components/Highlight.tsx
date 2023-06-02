import React, { Component, RefObject } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/monokai-sublime.css";

interface HighlightProps {
  language?: string;
}

interface HighlightState {
  loaded: boolean;
  registeredLanguages: { [key: string]: boolean };
}

class Highlight extends Component<HighlightProps, HighlightState> {
  codeNode: RefObject<HTMLElement>;

  constructor(props: any) {
    super(props);

    this.state = { 
      loaded: false,
      registeredLanguages: {}
    };
    this.codeNode = React.createRef();
  }

  componentDidMount() {
    const { language } = this.props;
    const { registeredLanguages } = this.state;

    if (language && !registeredLanguages[language]) {
      try {
        const newLanguage = require(`highlight.js/lib/languages/${language}`);
        hljs.registerLanguage(language, newLanguage);
        registeredLanguages[language] = true;

        this.setState({ loaded: true, registeredLanguages }, this.highlight);
      } catch (e) {
        console.error(e);
        throw Error(`Cannot register the language ${language}`);
      }
    } else {
      this.setState({ loaded: true });
    }
  }

  componentDidUpdate() {
    this.highlight();
  }

  highlight = () => {
    this.codeNode &&
      this.codeNode.current &&
      hljs.highlightBlock(this.codeNode.current);
  };

  render() {
    const { language, children } = this.props;
    const { loaded } = this.state;

    if (!loaded) {
      return null;
    }

    return (
      <pre className="rounded">
        <code ref={this.codeNode} className={language}>
          {children}
        </code>
      </pre>
    );
  }
}

export default Highlight;
