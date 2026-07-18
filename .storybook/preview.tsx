import type { Preview } from '@storybook/react-vite'
import '@/index.css'
import '@xyflow/react/dist/style.css'
import { TooltipProvider } from '@/components/ui/tooltip'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
  },
  decorators: [
    (Story) => (
      <div className="dark bg-background p-6 text-foreground">
        <TooltipProvider>
          <Story />
        </TooltipProvider>
      </div>
    ),
  ],
};

export default preview;