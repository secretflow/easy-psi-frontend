/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！

declare namespace API {
  type AdvancedConfig = Record<string, any>;

  type AdvancedJoinTypeEnum = Record<string, any>;

  interface AgreeProjectJobTaskRequest {
    /** job id */
    jobId?: string;
  }

  type AuthErrorCode =
    | 202011600
    | 'USER_NOT_FOUND'
    | 202011601
    | 'USER_PASSWORD_ERROR'
    | 202011602
    | 'AUTH_FAILED'
    | 202011603
    | 'USER_IS_LOCKED'
    | 202011604
    | 'RESET_PASSWORD_IS_LOCKED';

  type ContextDescProto = Record<string, any>;

  interface CreateNodeRequest {
    /** certTxt */
    certText?: string;
    /** NodeId */
    dstNodeId?: string;
    /** 本方通讯地址 */
    srcNetAddress?: string;
    /** dstNetAddress */
    dstNetAddress?: string;
    /** nodeRemark */
    nodeRemark?: string;
  }

  interface CreateProjectJobRequest {
    /** name */
    name?: string;
    /** description */
    description?: string;
    /** initiatorConfig */
    initiatorConfig?: CreateProjectJobRequestPsiConfig;
    /** partnerConfig */
    partnerConfig?: CreateProjectJobRequestPsiConfig;
    /** outputConfig */
    outputConfig?: CreateProjectJobRequestPsiConfig;
    /** advancedConfig */
    advancedConfig?: CreateProjectJobRequestAdvancedConfig;
  }

  type CreateProjectJobRequestAdvancedConfig = Record<string, any>;

  type CreateProjectJobRequestPsiConfig = Record<string, any>;

  interface CreateProjectJobTaskRequest {
    jobId?: string;
    /** name */
    name?: string;
    /** description */
    description?: string;
    /** initiatorConfig */
    initiatorConfig?: CreateProjectJobTaskRequestPsiConfig;
    /** partnerConfig */
    partnerConfig?: CreateProjectJobTaskRequestPsiConfig;
  }

  type CreateProjectJobTaskRequestPsiConfig = Record<string, any>;

  interface CreateProjectJobVO {
    name?: string;
    jobId?: string;
  }

  type DataErrorCode =
    | 202011801
    | 'FILE_NAME_EMPTY'
    | 202011802
    | 'FILE_TYPE_NOT_SUPPORT'
    | 202011803
    | 'FILE_EXISTS_ERROR'
    | 202011804
    | 'FILE_NOT_EXISTS_ERROR'
    | 202011805
    | 'ILLEGAL_PARAMS_ERROR'
    | 202011806
    | 'NAME_DUPLICATION_ERROR'
    | 202011807
    | 'FILE_PATH_EMPTY'
    | 202011808
    | 'FILE_PATH_ERROR'
    | 202011809
    | 'QUERY_DATA_ERROR';

  type DataResourceType = 'NODE_ID' | 'PROJECT_ID';

  interface DataSourceVO {
    /** path */
    path?: string;
  }

  type DataTableInformation = Record<string, any>;

  interface DataTableInformationVo {
    srcDataTableInformation?: DataTableInformationVoDataTableInformation;
    dstDataTableInformation?: DataTableInformationVoDataTableInformation;
  }

  type DataTableInformationVoDataTableInformation = Record<string, any>;

  interface DataVersionVO {
    secretpadTag?: string;
    kusciaTag?: string;
    secretflowTag?: string;
  }

  interface DeleteNodeIdRequest {
    /** routerId */
    routerId?: string;
  }

  interface DeleteProjectJobTaskRequest {
    /** Job id, it can not be blank */
    jobId?: string;
  }

  interface DownloadNodeCertificateRequest {
    /** Node id */
    nodeId?: string;
  }

  interface DownloadProjectResult {
    /** jobId */
    jobId?: string;
  }

  interface GetDataTableInformatinoRequest {
    dstNodeId?: string;
    dstDataTableName?: string;
    srcDataTableName?: string;
  }

  interface GetProjectJobDataHeaderRequest {
    /** Project job csv data table name */
    checkTableHeader?: Array<string>;
    /** Project job csv data table name */
    tableName?: string;
    /** Check project job csv data table header */
    checkDataHeaderExist?: boolean;
  }

  interface GetProjectJobLogRequest {
    /** Job id, it can not be blank */
    jobId?: string;
  }

  interface GetProjectJobRequest {
    /** Job id */
    jobId?: string;
  }

  interface GetProjectJobTableRequest {
    /** Project job csv data table name */
    tableName?: string;
    /** Check Project job csv data table */
    checkTableExist?: boolean;
  }

  interface GetloadProjectResult {
    /** hash */
    hash?: string;
  }

  interface GrapDataHeaderVO {
    /** csv data table name */
    tableName?: string;
    /** csv data table header */
    dataHeader?: Array<string>;
    /** check date header exist */
    result?: boolean;
    /** csv data exist header */
    existHeader?: Array<string>;
    /** csv data absent header */
    absentHeader?: Array<string>;
  }

  interface GrapDataTableVO {
    /** csv data Table */
    dataTable?: Array<string>;
    /** check date exist */
    result?: boolean;
  }

  type GraphJobOperation =
    | 'AGREE'
    | 'REJECT'
    | 'PAUSE'
    | 'CONTINUE'
    | 'CANCEL'
    | 'DELETE'
    | 'LOG'
    | 'DOWNLOAD_RESULT'
    | 'UPLOAD_CERT';

  type GraphJobStatus =
    | 'PENDING_CERT'
    | 'PENDING_REVIEW'
    | 'RUNNING'
    | 'PAUSED'
    | 'TIMEOUT'
    | 'CANCELED'
    | 'REJECTED'
    | 'SUCCEEDED'
    | 'FAILED';

  interface GraphNodeJobLogsVO {
    /** Graph node task status */
    status?: GraphJobStatus;
    /** Task logs */
    logs?: Array<string>;
  }

  type GraphNodeTaskStatus =
    | 'STAGING'
    | 'INITIALIZED'
    | 'RUNNING'
    | 'STOPPED'
    | 'SUCCEED'
    | 'FAILED';

  type HttpServletRequest = Record<string, any>;

  type HttpServletResponse = Record<string, any>;

  type InputConfig = Record<string, any>;

  type JobErrorCode =
    | 202011901
    | 'PROJECT_JOB_NOT_EXISTS'
    | 202011902
    | 'PROJECT_JOB_CREATE_ERROR'
    | 202011905
    | 'PROJECT_DATA_NOT_EXISTS_ERROR'
    | 202011906
    | 'PROJECT_LOG_NOT_EXISTS_ERROR'
    | 202011908
    | 'PROJECT_JOB_RESULT_DOWNLOAD_ERROR'
    | 202011909
    | 'PROJECT_TABLE_HEADER_NOT_EXISTS_ERROR'
    | 202011910
    | 'PROJECT_JOB_RPC_ERROR'
    | 202011911
    | 'PROJECT_JOB_ACTION_NOT_ALLOWED'
    | 202011912
    | 'PROJECT_DATA_PATH_NOT_EXISTS_ERROR'
    | 202011913
    | 'PROJECT_LOG_PATH_NOT_EXISTS_ERROR'
    | 202011914
    | 'PROJECT_JOB_RESULT_HASH_EXPIRED_ERROR';

  type KusciaGrpcErrorCode =
    | 202012101
    | 'RPC_ERROR'
    | 202012102
    | 'KUSCIA_CPMMECT_ERROR';

  interface ListProjectJobRequest {
    /** What page is currently requested? Note that starting at 1 represents the first page */
    pageNum?: number;
    /** How many pieces of data are in each page */
    pageSize?: number;
    statusFilter?: Array<GraphJobStatus>;
    search?: string;
    sortKey?: string;
    sortType?: string;
  }

  interface LoginRequest {
    /** User name */
    name?: string;
    /** User password */
    passwordHash?: string;
  }

  type NodeErrorCode =
    | 202011402
    | 'NODE_CREATE_ERROR'
    | 202011403
    | 'NODE_NOT_EXIST_ERROR'
    | 202011404
    | 'NODE_DELETE_ERROR'
    | 202011409
    | 'NODE_CERT_CONFIG_ERROR'
    | 202011410
    | 'NODE_DELETE_UNFINISHED_ERROR';

  type NodeRouteErrorCode =
    | 202012901
    | 'NODE_ROUTE_ALREADY_EXISTS'
    | 202012902
    | 'NODE_ROUTE_CREATE_ERROR'
    | 202012903
    | 'NODE_ROUTE_NOT_EXIST_ERROR'
    | 202012904
    | 'NODE_ROUTE_DELETE_ERROR'
    | 202012905
    | 'NODE_ROUTE_UPDATE_ERROR'
    | 202012906
    | 'NODE_ROUTE_CONFIG_ERROR'
    | 202012907
    | 'NODE_ROUTE_NOT_READY'
    | 202012909
    | 'NODE_ROUTE_UPDATE_UNFINISHED_ERROR';

  interface NodeRouterVO {
    /** id */
    routeId?: string;
    /** srcNodeId */
    srcNodeId?: string;
    /** dstNodeId */
    dstNodeId?: string;
    /** srcNode */
    srcNode?: NodeVO;
    /** dstNode */
    dstNode?: NodeVO;
    /** srcNetAddress */
    srcNetAddress?: string;
    /** dstNetAddress */
    dstNetAddress?: string;
    /** status Pending, Succeeded, Failed, Unknown */
    status?: string;
    /** gmtCreate */
    gmtCreate?: string;
    /** gmtModified */
    gmtModified?: string;
  }

  interface NodeVO {
    /** id */
    nodeId?: string;
    /** nodeName */
    nodeName?: string;
    /** controlNodeId */
    controlNodeId?: string;
    /** description */
    description?: string;
    /** netAddress */
    netAddress?: string;
    /** nodeStatus Pending, Ready, NotReady, Unknown */
    nodeStatus?: string;
    /** gmtCreate */
    gmtCreate?: string;
    /** gmtModified */
    gmtModified?: string;
    /** nodeCertText */
    certText?: string;
    /** nodeRemark */
    nodeRemark?: string;
  }

  type OneApiResult_object_ = Record<string, any>;

  type OneApiResult_string_ = Record<string, any>;

  interface OrgSecretflowSecretpadServiceModelProjectCreateProjectJobTaskRequest$PsiConfigCreateProjectJobTaskRequestPsiConfig {
    nodeId?: string;
    protocolConfig?: CreateProjectJobTaskRequestPsiConfigProtocolConfig;
    inputConfig?: CreateProjectJobTaskRequestPsiConfigInputConfig;
    outputConfig?: CreateProjectJobTaskRequestPsiConfigOutputConfig;
    linkConfig?: CreateProjectJobTaskRequestPsiConfigContextDescProto;
    keys?: Array<string>;
    skipDuplicatesCheck?: boolean;
    disableAlignment?: boolean;
    recoveryConfig?: CreateProjectJobTaskRequestPsiConfigRecoveryConfig;
    advancedJoinType?: JobConstantsAdvancedJoinTypeEnum;
    outputDifference?: boolean;
    datatableCount?: string;
  }

  type OutputConfig = Record<string, any>;

  interface PageRequest {
    /** What page is currently requested? Note that starting at 1 represents the first page */
    pageNum?: number;
    /** How many pieces of data are in each page */
    pageSize?: number;
  }

  type PermissionTargetType = 'ROLE';

  type PermissionUserType = 'USER' | 'EDGE_USER' | 'NODE';

  type PlatformType = 'EDGE' | 'CENTER' | 'P2P';

  type ProjectErrorCode = 202011505 | 'PROJECT_RESULT_NOT_FOUND';

  interface ProjectJobBaseVO {
    /** Job id */
    jobId?: string;
    /** Job status */
    status?: GraphJobStatus;
    /** Job error message */
    errMsg?: string;
    /** Job start time */
    gmtCreate?: string;
    /** Job update time */
    gmtModified?: string;
    /** Job finish time */
    gmtFinished?: string;
  }

  interface ProjectJobListVO {
    /** Job id */
    jobId?: string;
    /** Job status */
    status?: GraphJobStatus;
    /** Job error message */
    errMsg?: string;
    /** Job start time */
    gmtCreate?: string;
    /** Job update time */
    gmtModified?: string;
    /** Job finish time */
    gmtFinished?: string;
    /** name */
    name?: string;
    /** srcNodeId */
    srcNodeId?: string;
    /** dstNodeId */
    dstNodeId?: string;
    /** operation */
    operation?: Array<GraphJobOperation>;
    /** enabled */
    enabled?: boolean;
    /** DataTableInformation */
    initiatorDataTableInformation?: DataTableInformationVoDataTableInformation;
    /** DataTableInformation */
    partnerdstDataTableInformation?: DataTableInformationVoDataTableInformation;
  }

  interface ProjectJobVO {
    /** Job id */
    jobId?: string;
    /** Job status */
    status?: GraphJobStatus;
    /** Job error message */
    errMsg?: string;
    /** Job start time */
    gmtCreate?: string;
    /** Job update time */
    gmtModified?: string;
    /** Job finish time */
    gmtFinished?: string;
    /** name */
    name?: string;
    /** description */
    description?: string;
    /** initiatorConfig */
    initiatorConfig?: CreateProjectJobTaskRequestPsiConfig;
    /** partnerConfig */
    partnerConfig?: CreateProjectJobTaskRequestPsiConfig;
    startTime?: string;
    operation?: Array<GraphJobOperation>;
  }

  type ProtocolConfig = Record<string, any>;

  type PsiConfig = Record<string, any>;

  type RecoveryConfig = Record<string, any>;

  interface RejectProjectJobTaskRequest {
    /** Job id, it can not be blank */
    jobId?: string;
    rejectMsg?: string;
  }

  type ResourceType = 'INTERFACE' | 'NODE_ID';

  interface RouterAddressRequest {
    /** address */
    netAddress?: string;
  }

  interface RouterIdRequest {
    /** routerId */
    routerId?: string;
  }

  interface SecretPadPageResponse {
    /** page list */
    list?: Array<Record<string, any>>;
    /** total */
    total?: number;
  }

  interface SecretPadPageResponse_ProjectJobListVO_ {
    /** page list */
    list?: Array<ProjectJobListVO>;
    /** total */
    total?: number;
  }

  interface SecretPadResponse {
    status?: SecretPadResponseSecretPadResponseStatus;
    data?: Record<string, any>;
  }

  type SecretPadResponseSecretPadResponseStatus = Record<string, any>;

  type SecretPadResponseStatus = Record<string, any>;

  interface SecretPadResponse_Boolean_ {
    status?: SecretPadResponseSecretPadResponseStatus;
    data?: boolean;
  }

  interface SecretPadResponse_CreateProjectJobVO_ {
    status?: SecretPadResponseSecretPadResponseStatus;
    data?: CreateProjectJobVO;
  }

  interface SecretPadResponse_DataSourceVO_ {
    status?: SecretPadResponseSecretPadResponseStatus;
    data?: DataSourceVO;
  }

  interface SecretPadResponse_DataTableInformationVo_ {
    status?: SecretPadResponseSecretPadResponseStatus;
    data?: DataTableInformationVo;
  }

  interface SecretPadResponse_DataVersionVO_ {
    status?: SecretPadResponseSecretPadResponseStatus;
    data?: DataVersionVO;
  }

  interface SecretPadResponse_GrapDataHeaderVO_ {
    status?: SecretPadResponseSecretPadResponseStatus;
    data?: GrapDataHeaderVO;
  }

  interface SecretPadResponse_GrapDataTableVO_ {
    status?: SecretPadResponseSecretPadResponseStatus;
    data?: GrapDataTableVO;
  }

  interface SecretPadResponse_GraphNodeJobLogsVO_ {
    status?: SecretPadResponseSecretPadResponseStatus;
    data?: GraphNodeJobLogsVO;
  }

  interface SecretPadResponse_List_NodeRouterVO__ {
    status?: SecretPadResponseSecretPadResponseStatus;
    data?: Array<NodeRouterVO>;
  }

  interface SecretPadResponse_List_ProjectJobVO__ {
    status?: SecretPadResponseSecretPadResponseStatus;
    data?: Array<ProjectJobVO>;
  }

  interface SecretPadResponse_NodeRouterVO_ {
    status?: SecretPadResponseSecretPadResponseStatus;
    data?: NodeRouterVO;
  }

  interface SecretPadResponse_NodeVO_ {
    status?: SecretPadResponseSecretPadResponseStatus;
    data?: NodeVO;
  }

  interface SecretPadResponse_ProjectJobVO_ {
    status?: SecretPadResponseSecretPadResponseStatus;
    data?: ProjectJobVO;
  }

  interface SecretPadResponse_SecretPadPageResponse_ProjectJobListVO__ {
    status?: SecretPadResponseSecretPadResponseStatus;
    data?: SecretPadPageResponse_ProjectJobListVO_;
  }

  interface SecretPadResponse_String_ {
    status?: SecretPadResponseSecretPadResponseStatus;
    data?: string;
  }

  interface SecretPadResponse_UploadNodeResultVO_ {
    status?: SecretPadResponseSecretPadResponseStatus;
    data?: UploadNodeResultVO;
  }

  interface SecretPadResponse_UserContextDTO_ {
    status?: SecretPadResponseSecretPadResponseStatus;
    data?: UserContextDTO;
  }

  interface SecretPadResponse_Void_ {
    status?: SecretPadResponseSecretPadResponseStatus;
    data?: Record<string, any>;
  }

  interface StopProjectJobTaskRequest {
    /** Job id, it can not be blank */
    jobId?: string;
  }

  type SystemErrorCode =
    | 202011100
    | 'VALIDATION_ERROR'
    | 202011101
    | 'UNKNOWN_ERROR'
    | 202011103
    | 'HTTP_4XX_ERROR'
    | 202011104
    | 'HTTP_404_ERROR'
    | 202011105
    | 'HTTP_5XX_ERROR';

  interface UpdateNodeRouterRequest {
    /** routerId */
    routerId?: string;
    /** srcNetAddress */
    srcNetAddress?: string;
    /** dstNetAddress */
    dstNetAddress?: string;
  }

  interface UploadNodeResultVO {
    /** Node id */
    nodeId?: string;
    /** Certificate */
    certificate?: string;
  }

  interface UserContextDTO {
    token?: string;
    name?: string;
    platformType?: PlatformType;
    platformNodeId?: string;
    ownerType?: UserOwnerType;
    ownerId?: string;
    interfaceResources?: Array<string>;
    /** only for edge platform rpc. */
    virtualUserForNode?: boolean;
    noviceUser?: boolean;
  }

  type UserErrorCode =
    | 202012001
    | 'USER_UPDATE_PASSWORD_ERROR_INCONSISTENT'
    | 202012002
    | 'USER_UPDATE_PASSWORD_ERROR_SAME'
    | 202012003
    | 'USER_UPDATE_PASSWORD_ERROR_INCORRECT';

  type UserOwnerType = 'EDGE' | 'CENTER' | 'P2P';

  interface UserUpdatePwdRequest {
    /** User name */
    name?: string;
    /** User old password */
    oldPasswordHash?: string;
    /** User new password */
    newPasswordHash?: string;
    /** User confirm password */
    confirmPasswordHash?: string;
  }
}
