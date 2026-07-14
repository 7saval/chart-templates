import type { Meta, StoryObj } from '@storybook/react';
import { PipelineFlowConnector } from './PipelineFlowConnector';

const meta: Meta<typeof PipelineFlowConnector> = {
  title: '🔗 Flow/PipelineFlowConnector (참고용, 미사용)',
  component: PipelineFlowConnector,
  parameters: {
    docs: {
      description: {
        component:
          'Ch2/Ch4 도입 이후에는 `PipelineFlowDiagram`(React Flow)이 대체합니다. 이 컴포넌트는 수동 SVG bezier 커넥터 방식과의 비교 참고용으로만 남겨둡니다.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof PipelineFlowConnector>;

export const Default: Story = {
  args: {
    label: 'events/s',
  },
};

export const Bottleneck: Story = {
  args: {
    label: 'lag 210k',
    isBottleneck: true,
  },
};

export const WithoutLabel: Story = {
  args: {},
};

export const Wide: Story = {
  args: {
    label: 'throughput',
    width: 160,
    height: 60,
  },
};
