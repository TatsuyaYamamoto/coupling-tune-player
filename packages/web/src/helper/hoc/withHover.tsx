import React from "react";

export interface WithHoverProps {
  hover: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

interface HocProps {}

interface HocState {
  hover: boolean;
}

/**
 * HOC for provide onHover state.
 *
 * @param {React.ComponentClass} WrappedComponent
 * @returns {React.ComponentClass}
 */
function withHover<P>(
  WrappedComponent: React.ComponentType<P & WithHoverProps>
): React.ComponentType<P> {
  return class extends React.Component<P> {
    public state = {
      hover: false
    };

    private onMouseEnter = () => {
      this.setState({ hover: true });
    };

    private onMouseLeave = () => {
      this.setState({ hover: false });
    };

    render() {
      const { hover } = this.state;

      const newProps = Object.assign({}, this.props, {
        hover,
        onMouseEnter: this.onMouseEnter,
        onMouseLeave: this.onMouseLeave
      });

      return React.createElement(WrappedComponent, newProps);
    }
  };
}

export default withHover;
