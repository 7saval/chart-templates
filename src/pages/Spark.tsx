import { SectionPanel } from "@/components/layout/SectionPanel";
import { PipelineFlowDiagram } from "@/components/flow/PipelineFlowDiagram/PipelineFlowDiagram";
import { sparkClusterNodes, sparkClusterEdges } from "@/mocks/spark.mock";

export default function Spark() {
  return (
    <SectionPanel title="Spark Cluster Overview">
      <PipelineFlowDiagram
        nodes={sparkClusterNodes}
        edges={sparkClusterEdges}
        height={280}
      />
    </SectionPanel>
  );
}
