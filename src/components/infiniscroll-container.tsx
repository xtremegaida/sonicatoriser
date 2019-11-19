import React from 'react';
import ResizeDetector from 'react-resize-detector';

export class InfiniscrollContainer extends React.Component<InfiniscrollContainerProps, {}> {
  private scrollElement: HTMLDivElement | null = null;

  private getMinHeight(containerHeight: number)
  {
    var height = containerHeight;
    if (this.props.scrollOffset > 0) { height += this.props.scrollOffset; }
    if (height < this.props.minHeight) { height = this.props.minHeight; }
    return Math.ceil(height / 200) * 200;
  }

  private setScroll() {
    if (!this.scrollElement) { return; }
    this.scrollElement.scrollTop = this.props.scrollOffset;
  }

  componentDidMount() { this.setScroll(); }
  componentDidUpdate() { this.setScroll(); }

  render() {
    return <ResizeDetector
      handleHeight
      render={({ height }) => (
        <div style={{ height: height + 'px', width: '100%', overflowY: 'scroll' }}>
          <div style={{ height: this.getMinHeight(height) + 'px', width: '100%', position: 'relative' }} ref={e => this.scrollElement = e}
               onScroll={e => this.scrollElement && this.props.scrollOffsetChanged(this.scrollElement.scrollTop)}>
            {this.props.render(this.scrollElement ? this.scrollElement.scrollTop : this.props.scrollOffset)}
          </div>
        </div>
      )}
    />;
  }
}

export interface InfiniscrollContainerProps {
  minHeight: number;
  scrollOffset: number;
  scrollOffsetChanged: (scrollOffset: number) => void;
  render: (scrollOffset: number) => JSX.Element;
}
