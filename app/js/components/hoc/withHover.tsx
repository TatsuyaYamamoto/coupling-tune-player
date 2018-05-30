import * as React from "react";

export interface WithHoverProps {
  hover: boolean;
}

function withHover(WrappedComponent: React.ComponentType) {
  return class extends React.Component {
    state = {
      hover: false
    };

    private onMouseEnter = () => {
      this.setState({ isHovered: true });
    };

    private onMouseLeave = () => {
      this.setState({ isHovered: false });
    };

    render() {
      return (
        <div>
          <WrappedComponent />
        </div>
      );
    }
  };
}

export default withHover;
