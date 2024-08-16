const { createRoot } = ReactDOM;

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return "You liked this.";
    }

    return React.createElement(
      "button",
      { type: "button", onClick: () => this.setState({ liked: true }) },
      "Like"
    );
  }
}

const domContainer = document.querySelector("#react-root");
const root = createRoot(domContainer);
root.render(
  React.createElement(React.StrictMode, null, React.createElement(LikeButton))
);
