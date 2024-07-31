import { Document } from 'mongoose';

export interface PromScrapeModel extends Document {
  honor_labels: boolean;
  job_name: string;
  metrics_path: string;
  params: object;
  relabel_configs: any[];
  scrape_interval: string;
  evaluation_interval: string;
  static_configs: any[];
}

// ==============================================
// CONTAINER TYPES
// ==============================================
// Stopped containers have a Names key and running containers have a Name key
export interface ContainerType {
  ID: string;
  Names?: string;
  Image?: string;
  RunningFor?: string;
  Networks?: string[];
}

// for networkReducer's initial state
export interface NetworkContainerListType {
  networkName: string;
  containers: NetworkAttachedContainersInfo[];
}

// Relates to above interfaces containers property
export interface NetworkAttachedContainersInfo {
    containerName: string;
    containerIP: string;
  }

// for networkReducer's action
export interface NetworkStateType {
  networkContainerList: NetworkContainerListType[];
}

export interface StoppedListType extends ContainerType {
  Img: string;
  Created: string;
  name: string;
}

// export interface RunningListType {
//   Names?: string;
//   ID: string;
//   Image: string;
//   RunningFor: string;
// }

// *UNUSED*
// export interface ContainerStateType {
//   runningList: ContainerType[];
//   stoppedList: StoppedListType[];
//   networkList: string[];
//   composeStack: any[];
// }

// for container's being run
export interface ContainerObj extends ContainerType {
  Container: string;
}

// for container's being stopped
export interface StoppedContainerObj extends ContainerType {
  Command: string;
  CreatedAt: string;
  Labels: string;
  LocalVolumes: string;
  Mounts: string;
  Ports: string;
  Size: string;
  State: string;
  Status: string;
  ModalOpen?: boolean;
}

// *UNUSED*
// export interface containersList {
//   runningList: ContainerType[];
//   stoppedList: StoppedListType[];
// }

export interface ConnectOrDisconnectProps {
  container: ContainerType;
  networkName: string;
  connectToNetwork: (networkName: string, containerName: string) => void;
  disconnectFromNetwork: (networkName: string, containerName: string) => void;
}

export interface NetworkListModalProps {
  Names: string,
  container: ContainerType,
  isOpen: boolean,
  connectToNetwork: (network: string, container: string) => void;
  disconnectFromNetwork: (network: string, container: string) => void;
  closeNetworkList: () => void;
  networkContainerList: NetworkContainerListType[];
}
// ==========================================================
// Server-Side Typing
// ==========================================================
export interface ServerError {
  log: {
    err: string;
  };
  status: number;
  message: string
};

export interface ContainerNetworkObject {
  Name: string;
  Id: string;
  CreatedAt: string;
  Labels: Record<string, string>;
  FilePath?: string;
  YmlFileName?: string;
}

export interface MetricsQuery {
  id: number;
  container_id: string;
  container_name: string;
  cpu_pct: string;
  memory_pct: string;
  memory_usage: string;
  net_io: string;
  block_io: string;
  pid: string;
  created_at: Date;
}

// ==============================================
// BACKEND IMAGE TYPES
// ==============================================
//Data generated from running GrypeScan on imageControllers.scanImages
export interface GrypeScan {
  'Package': string;
  'Version Installed'?: string;
  'Fixed State'?: string;
  'Fixed In'?: string;
  'Description'?: string;
  'Vulnerability ID'?: string;
  'Severity'?: string;
  'Data Source'?: string;
}

export interface countVulnerability {
  Negligible?: number;
  Low?: number;
  Medium?: number;
  High?: number;
  Critical?: number;
  [key: string]: number | undefined;
}