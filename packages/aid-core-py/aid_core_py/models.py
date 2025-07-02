from typing import Any, Optional, List, Union, TypeVar, Callable, Type, cast
from enum import Enum


T = TypeVar("T")
EnumT = TypeVar("EnumT", bound=Enum)


def from_str(x: Any) -> str:
    assert isinstance(x, str)
    return x


def from_none(x: Any) -> Any:
    assert x is None
    return x


def from_union(fs, x):
    for f in fs:
        try:
            return f(x)
        except:
            pass
    assert False


def from_bool(x: Any) -> bool:
    assert isinstance(x, bool)
    return x


def from_list(f: Callable[[Any], T], x: Any) -> List[T]:
    assert isinstance(x, list)
    return [f(y) for y in x]


def to_enum(c: Type[EnumT], x: Any) -> EnumT:
    assert isinstance(x, c)
    return x.value


def to_class(c: Type[T], x: Any) -> dict:
    assert isinstance(x, c)
    return cast(Any, x).to_dict()


def from_float(x: Any) -> float:
    assert isinstance(x, (float, int)) and not isinstance(x, bool)
    return float(x)


def to_float(x: Any) -> float:
    assert isinstance(x, (int, float))
    return x


class Credential:
    description: str
    key: str

    def __init__(self, description: str, key: str) -> None:
        self.description = description
        self.key = key

    @staticmethod
    def from_dict(obj: Any) -> 'Credential':
        assert isinstance(obj, dict)
        description = from_str(obj.get("description"))
        key = from_str(obj.get("key"))
        return Credential(description, key)

    def to_dict(self) -> dict:
        result: dict = {}
        result["description"] = from_str(self.description)
        result["key"] = from_str(self.key)
        return result


class Oauth:
    client_id: Optional[str]
    dynamic_client_registration: Optional[bool]
    """If true, signals support for RFC 7591 Dynamic Client Registration."""

    scopes: Optional[List[str]]

    def __init__(self, client_id: Optional[str], dynamic_client_registration: Optional[bool], scopes: Optional[List[str]]) -> None:
        self.client_id = client_id
        self.dynamic_client_registration = dynamic_client_registration
        self.scopes = scopes

    @staticmethod
    def from_dict(obj: Any) -> 'Oauth':
        assert isinstance(obj, dict)
        client_id = from_union([from_str, from_none], obj.get("clientId"))
        dynamic_client_registration = from_union([from_bool, from_none], obj.get("dynamicClientRegistration"))
        scopes = from_union([lambda x: from_list(from_str, x), from_none], obj.get("scopes"))
        return Oauth(client_id, dynamic_client_registration, scopes)

    def to_dict(self) -> dict:
        result: dict = {}
        if self.client_id is not None:
            result["clientId"] = from_union([from_str, from_none], self.client_id)
        if self.dynamic_client_registration is not None:
            result["dynamicClientRegistration"] = from_union([from_bool, from_none], self.dynamic_client_registration)
        if self.scopes is not None:
            result["scopes"] = from_union([lambda x: from_list(from_str, x), from_none], self.scopes)
        return result


class In(Enum):
    CLI_ARG = "cli_arg"
    HEADER = "header"
    QUERY = "query"


class Placement:
    format: Optional[str]
    placement_in: In
    key: str

    def __init__(self, format: Optional[str], placement_in: In, key: str) -> None:
        self.format = format
        self.placement_in = placement_in
        self.key = key

    @staticmethod
    def from_dict(obj: Any) -> 'Placement':
        assert isinstance(obj, dict)
        format = from_union([from_str, from_none], obj.get("format"))
        placement_in = In(obj.get("in"))
        key = from_str(obj.get("key"))
        return Placement(format, placement_in, key)

    def to_dict(self) -> dict:
        result: dict = {}
        if self.format is not None:
            result["format"] = from_union([from_str, from_none], self.format)
        result["in"] = to_enum(In, self.placement_in)
        result["key"] = from_str(self.key)
        return result


class Scheme(Enum):
    APIKEY = "apikey"
    BASIC = "basic"
    CUSTOM = "custom"
    MTLS = "mtls"
    NONE = "none"
    OAUTH2_CODE = "oauth2_code"
    OAUTH2_DEVICE = "oauth2_device"
    OAUTH2_SERVICE = "oauth2_service"
    PAT = "pat"


class Authentication:
    scheme: Scheme
    credentials: Optional[List[Credential]]
    description: Optional[str]
    placement: Optional[Placement]
    token_url: Any
    oauth: Optional[Oauth]

    def __init__(self, scheme: Scheme, credentials: Optional[List[Credential]], description: Optional[str], placement: Optional[Placement], token_url: Any, oauth: Optional[Oauth]) -> None:
        self.scheme = scheme
        self.credentials = credentials
        self.description = description
        self.placement = placement
        self.token_url = token_url
        self.oauth = oauth

    @staticmethod
    def from_dict(obj: Any) -> 'Authentication':
        assert isinstance(obj, dict)
        scheme = Scheme(obj.get("scheme"))
        credentials = from_union([lambda x: from_list(Credential.from_dict, x), from_none], obj.get("credentials"))
        description = from_union([from_str, from_none], obj.get("description"))
        placement = from_union([Placement.from_dict, from_none], obj.get("placement"))
        token_url = obj.get("tokenUrl")
        oauth = from_union([Oauth.from_dict, from_none], obj.get("oauth"))
        return Authentication(scheme, credentials, description, placement, token_url, oauth)

    def to_dict(self) -> dict:
        result: dict = {}
        result["scheme"] = to_enum(Scheme, self.scheme)
        if self.credentials is not None:
            result["credentials"] = from_union([lambda x: from_list(lambda x: to_class(Credential, x), x), from_none], self.credentials)
        if self.description is not None:
            result["description"] = from_union([from_str, from_none], self.description)
        if self.placement is not None:
            result["placement"] = from_union([lambda x: to_class(Placement, x), from_none], self.placement)
        if self.token_url is not None:
            result["tokenUrl"] = self.token_url
        if self.oauth is not None:
            result["oauth"] = from_union([lambda x: to_class(Oauth, x), from_none], self.oauth)
        return result


class ResourceLinks:
    pass

    def __init__(self, ) -> None:
        pass

    @staticmethod
    def from_dict(obj: Any) -> 'ResourceLinks':
        assert isinstance(obj, dict)
        return ResourceLinks()

    def to_dict(self) -> dict:
        result: dict = {}
        return result


class StructuredOutput:
    pass

    def __init__(self, ) -> None:
        pass

    @staticmethod
    def from_dict(obj: Any) -> 'StructuredOutput':
        assert isinstance(obj, dict)
        return StructuredOutput()

    def to_dict(self) -> dict:
        result: dict = {}
        return result


class Capabilities:
    """A hint about supported MCP capabilities."""

    resource_links: Optional[ResourceLinks]
    structured_output: Optional[StructuredOutput]

    def __init__(self, resource_links: Optional[ResourceLinks], structured_output: Optional[StructuredOutput]) -> None:
        self.resource_links = resource_links
        self.structured_output = structured_output

    @staticmethod
    def from_dict(obj: Any) -> 'Capabilities':
        assert isinstance(obj, dict)
        resource_links = from_union([ResourceLinks.from_dict, from_none], obj.get("resourceLinks"))
        structured_output = from_union([StructuredOutput.from_dict, from_none], obj.get("structuredOutput"))
        return Capabilities(resource_links, structured_output)

    def to_dict(self) -> dict:
        result: dict = {}
        if self.resource_links is not None:
            result["resourceLinks"] = from_union([lambda x: to_class(ResourceLinks, x), from_none], self.resource_links)
        if self.structured_output is not None:
            result["structuredOutput"] = from_union([lambda x: to_class(StructuredOutput, x), from_none], self.structured_output)
        return result


class Source(Enum):
    ENROLLMENT = "enrollment"
    FILE = "file"


class Certificate:
    enrollment_endpoint: Any
    source: Source

    def __init__(self, enrollment_endpoint: Any, source: Source) -> None:
        self.enrollment_endpoint = enrollment_endpoint
        self.source = source

    @staticmethod
    def from_dict(obj: Any) -> 'Certificate':
        assert isinstance(obj, dict)
        enrollment_endpoint = obj.get("enrollmentEndpoint")
        source = Source(obj.get("source"))
        return Certificate(enrollment_endpoint, source)

    def to_dict(self) -> dict:
        result: dict = {}
        if self.enrollment_endpoint is not None:
            result["enrollmentEndpoint"] = self.enrollment_endpoint
        result["source"] = to_enum(Source, self.source)
        return result


class Linux:
    args: Optional[List[str]]
    command: Optional[str]
    digest: Optional[str]
    """An optional content digest for a platform-specific package."""

    def __init__(self, args: Optional[List[str]], command: Optional[str], digest: Optional[str]) -> None:
        self.args = args
        self.command = command
        self.digest = digest

    @staticmethod
    def from_dict(obj: Any) -> 'Linux':
        assert isinstance(obj, dict)
        args = from_union([lambda x: from_list(from_str, x), from_none], obj.get("args"))
        command = from_union([from_str, from_none], obj.get("command"))
        digest = from_union([from_str, from_none], obj.get("digest"))
        return Linux(args, command, digest)

    def to_dict(self) -> dict:
        result: dict = {}
        if self.args is not None:
            result["args"] = from_union([lambda x: from_list(from_str, x), from_none], self.args)
        if self.command is not None:
            result["command"] = from_union([from_str, from_none], self.command)
        if self.digest is not None:
            result["digest"] = from_union([from_str, from_none], self.digest)
        return result


class PlatformOverrides:
    linux: Optional[Linux]
    macos: Optional[Linux]
    windows: Optional[Linux]

    def __init__(self, linux: Optional[Linux], macos: Optional[Linux], windows: Optional[Linux]) -> None:
        self.linux = linux
        self.macos = macos
        self.windows = windows

    @staticmethod
    def from_dict(obj: Any) -> 'PlatformOverrides':
        assert isinstance(obj, dict)
        linux = from_union([Linux.from_dict, from_none], obj.get("linux"))
        macos = from_union([Linux.from_dict, from_none], obj.get("macos"))
        windows = from_union([Linux.from_dict, from_none], obj.get("windows"))
        return PlatformOverrides(linux, macos, windows)

    def to_dict(self) -> dict:
        result: dict = {}
        if self.linux is not None:
            result["linux"] = from_union([lambda x: to_class(Linux, x), from_none], self.linux)
        if self.macos is not None:
            result["macos"] = from_union([lambda x: to_class(Linux, x), from_none], self.macos)
        if self.windows is not None:
            result["windows"] = from_union([lambda x: to_class(Linux, x), from_none], self.windows)
        return result


class Execution:
    args: List[str]
    command: str
    platform_overrides: Optional[PlatformOverrides]

    def __init__(self, args: List[str], command: str, platform_overrides: Optional[PlatformOverrides]) -> None:
        self.args = args
        self.command = command
        self.platform_overrides = platform_overrides

    @staticmethod
    def from_dict(obj: Any) -> 'Execution':
        assert isinstance(obj, dict)
        args = from_list(from_str, obj.get("args"))
        command = from_str(obj.get("command"))
        platform_overrides = from_union([PlatformOverrides.from_dict, from_none], obj.get("platformOverrides"))
        return Execution(args, command, platform_overrides)

    def to_dict(self) -> dict:
        result: dict = {}
        result["args"] = from_list(from_str, self.args)
        result["command"] = from_str(self.command)
        if self.platform_overrides is not None:
            result["platformOverrides"] = from_union([lambda x: to_class(PlatformOverrides, x), from_none], self.platform_overrides)
        return result


class Package:
    digest: Optional[str]
    identifier: str
    manager: str

    def __init__(self, digest: Optional[str], identifier: str, manager: str) -> None:
        self.digest = digest
        self.identifier = identifier
        self.manager = manager

    @staticmethod
    def from_dict(obj: Any) -> 'Package':
        assert isinstance(obj, dict)
        digest = from_union([from_str, from_none], obj.get("digest"))
        identifier = from_str(obj.get("identifier"))
        manager = from_str(obj.get("manager"))
        return Package(digest, identifier, manager)

    def to_dict(self) -> dict:
        result: dict = {}
        if self.digest is not None:
            result["digest"] = from_union([from_str, from_none], self.digest)
        result["identifier"] = from_str(self.identifier)
        result["manager"] = from_str(self.manager)
        return result


class RequiredConfigType(Enum):
    BOOLEAN = "boolean"
    INTEGER = "integer"
    STRING = "string"


class RequiredConfig:
    default_value: Optional[Union[float, bool, str]]
    description: str
    key: str
    secret: Optional[bool]
    type: RequiredConfigType

    def __init__(self, default_value: Optional[Union[float, bool, str]], description: str, key: str, secret: Optional[bool], type: RequiredConfigType) -> None:
        self.default_value = default_value
        self.description = description
        self.key = key
        self.secret = secret
        self.type = type

    @staticmethod
    def from_dict(obj: Any) -> 'RequiredConfig':
        assert isinstance(obj, dict)
        default_value = from_union([from_float, from_bool, from_str, from_none], obj.get("defaultValue"))
        description = from_str(obj.get("description"))
        key = from_str(obj.get("key"))
        secret = from_union([from_bool, from_none], obj.get("secret"))
        type = RequiredConfigType(obj.get("type"))
        return RequiredConfig(default_value, description, key, secret, type)

    def to_dict(self) -> dict:
        result: dict = {}
        if self.default_value is not None:
            result["defaultValue"] = from_union([to_float, from_bool, from_str, from_none], self.default_value)
        result["description"] = from_str(self.description)
        result["key"] = from_str(self.key)
        if self.secret is not None:
            result["secret"] = from_union([from_bool, from_none], self.secret)
        result["type"] = to_enum(RequiredConfigType, self.type)
        return result


class RequiredPathType(Enum):
    DIRECTORY = "directory"
    FILE = "file"


class RequiredPath:
    description: str
    key: str
    type: Optional[RequiredPathType]

    def __init__(self, description: str, key: str, type: Optional[RequiredPathType]) -> None:
        self.description = description
        self.key = key
        self.type = type

    @staticmethod
    def from_dict(obj: Any) -> 'RequiredPath':
        assert isinstance(obj, dict)
        description = from_str(obj.get("description"))
        key = from_str(obj.get("key"))
        type = from_union([RequiredPathType, from_none], obj.get("type"))
        return RequiredPath(description, key, type)

    def to_dict(self) -> dict:
        result: dict = {}
        result["description"] = from_str(self.description)
        result["key"] = from_str(self.key)
        if self.type is not None:
            result["type"] = from_union([lambda x: to_enum(RequiredPathType, x), from_none], self.type)
        return result


class Status(Enum):
    ACTIVE = "active"
    DEPRECATED = "deprecated"


class ImplementationType(Enum):
    LOCAL = "local"
    REMOTE = "remote"


class Implementation:
    authentication: Authentication
    capabilities: Optional[Capabilities]
    """A hint about supported MCP capabilities."""

    certificate: Optional[Certificate]
    mcp_version: Optional[str]
    """A non-binding hint of the MCP version supported, e.g. '2025-06-18'"""

    name: str
    protocol: str
    required_config: Optional[List[RequiredConfig]]
    required_paths: Optional[List[RequiredPath]]
    revocation_url: Any
    status: Optional[Status]
    tags: Optional[List[str]]
    title: str
    type: ImplementationType
    uri: Optional[str]
    execution: Optional[Execution]
    package: Optional[Package]

    def __init__(self, authentication: Authentication, capabilities: Optional[Capabilities], certificate: Optional[Certificate], mcp_version: Optional[str], name: str, protocol: str, required_config: Optional[List[RequiredConfig]], required_paths: Optional[List[RequiredPath]], revocation_url: Any, status: Optional[Status], tags: Optional[List[str]], title: str, type: ImplementationType, uri: Optional[str], execution: Optional[Execution], package: Optional[Package]) -> None:
        self.authentication = authentication
        self.capabilities = capabilities
        self.certificate = certificate
        self.mcp_version = mcp_version
        self.name = name
        self.protocol = protocol
        self.required_config = required_config
        self.required_paths = required_paths
        self.revocation_url = revocation_url
        self.status = status
        self.tags = tags
        self.title = title
        self.type = type
        self.uri = uri
        self.execution = execution
        self.package = package

    @staticmethod
    def from_dict(obj: Any) -> 'Implementation':
        assert isinstance(obj, dict)
        authentication = Authentication.from_dict(obj.get("authentication"))
        capabilities = from_union([Capabilities.from_dict, from_none], obj.get("capabilities"))
        certificate = from_union([Certificate.from_dict, from_none], obj.get("certificate"))
        mcp_version = from_union([from_str, from_none], obj.get("mcpVersion"))
        name = from_str(obj.get("name"))
        protocol = from_str(obj.get("protocol"))
        required_config = from_union([lambda x: from_list(RequiredConfig.from_dict, x), from_none], obj.get("requiredConfig"))
        required_paths = from_union([lambda x: from_list(RequiredPath.from_dict, x), from_none], obj.get("requiredPaths"))
        revocation_url = obj.get("revocationURL")
        status = from_union([Status, from_none], obj.get("status"))
        tags = from_union([lambda x: from_list(from_str, x), from_none], obj.get("tags"))
        title = from_str(obj.get("title"))
        type = ImplementationType(obj.get("type"))
        uri = from_union([from_str, from_none], obj.get("uri"))
        execution = from_union([Execution.from_dict, from_none], obj.get("execution"))
        package = from_union([Package.from_dict, from_none], obj.get("package"))
        return Implementation(authentication, capabilities, certificate, mcp_version, name, protocol, required_config, required_paths, revocation_url, status, tags, title, type, uri, execution, package)

    def to_dict(self) -> dict:
        result: dict = {}
        result["authentication"] = to_class(Authentication, self.authentication)
        if self.capabilities is not None:
            result["capabilities"] = from_union([lambda x: to_class(Capabilities, x), from_none], self.capabilities)
        if self.certificate is not None:
            result["certificate"] = from_union([lambda x: to_class(Certificate, x), from_none], self.certificate)
        if self.mcp_version is not None:
            result["mcpVersion"] = from_union([from_str, from_none], self.mcp_version)
        result["name"] = from_str(self.name)
        result["protocol"] = from_str(self.protocol)
        if self.required_config is not None:
            result["requiredConfig"] = from_union([lambda x: from_list(lambda x: to_class(RequiredConfig, x), x), from_none], self.required_config)
        if self.required_paths is not None:
            result["requiredPaths"] = from_union([lambda x: from_list(lambda x: to_class(RequiredPath, x), x), from_none], self.required_paths)
        if self.revocation_url is not None:
            result["revocationURL"] = self.revocation_url
        if self.status is not None:
            result["status"] = from_union([lambda x: to_enum(Status, x), from_none], self.status)
        if self.tags is not None:
            result["tags"] = from_union([lambda x: from_list(from_str, x), from_none], self.tags)
        result["title"] = from_str(self.title)
        result["type"] = to_enum(ImplementationType, self.type)
        if self.uri is not None:
            result["uri"] = from_union([from_str, from_none], self.uri)
        if self.execution is not None:
            result["execution"] = from_union([lambda x: to_class(Execution, x), from_none], self.execution)
        if self.package is not None:
            result["package"] = from_union([lambda x: to_class(Package, x), from_none], self.package)
        return result


class Metadata:
    content_version: Optional[str]
    documentation: Any
    revocation_url: Any

    def __init__(self, content_version: Optional[str], documentation: Any, revocation_url: Any) -> None:
        self.content_version = content_version
        self.documentation = documentation
        self.revocation_url = revocation_url

    @staticmethod
    def from_dict(obj: Any) -> 'Metadata':
        assert isinstance(obj, dict)
        content_version = from_union([from_str, from_none], obj.get("contentVersion"))
        documentation = obj.get("documentation")
        revocation_url = obj.get("revocationURL")
        return Metadata(content_version, documentation, revocation_url)

    def to_dict(self) -> dict:
        result: dict = {}
        if self.content_version is not None:
            result["contentVersion"] = from_union([from_str, from_none], self.content_version)
        if self.documentation is not None:
            result["documentation"] = self.documentation
        if self.revocation_url is not None:
            result["revocationURL"] = self.revocation_url
        return result


class SchemaVersion(Enum):
    THE_1 = "1"


class AidManifest:
    """Canonical JSON configuration manifest for an Agent Interface Discovery (AID) profile.
    Version 1.
    """
    implementations: List[Implementation]
    metadata: Optional[Metadata]
    name: str
    schema_version: SchemaVersion
    signature: Any

    def __init__(self, implementations: List[Implementation], metadata: Optional[Metadata], name: str, schema_version: SchemaVersion, signature: Any) -> None:
        self.implementations = implementations
        self.metadata = metadata
        self.name = name
        self.schema_version = schema_version
        self.signature = signature

    @staticmethod
    def from_dict(obj: Any) -> 'AidManifest':
        assert isinstance(obj, dict)
        implementations = from_list(Implementation.from_dict, obj.get("implementations"))
        metadata = from_union([Metadata.from_dict, from_none], obj.get("metadata"))
        name = from_str(obj.get("name"))
        schema_version = SchemaVersion(obj.get("schemaVersion"))
        signature = obj.get("signature")
        return AidManifest(implementations, metadata, name, schema_version, signature)

    def to_dict(self) -> dict:
        result: dict = {}
        result["implementations"] = from_list(lambda x: to_class(Implementation, x), self.implementations)
        if self.metadata is not None:
            result["metadata"] = from_union([lambda x: to_class(Metadata, x), from_none], self.metadata)
        result["name"] = from_str(self.name)
        result["schemaVersion"] = to_enum(SchemaVersion, self.schema_version)
        if self.signature is not None:
            result["signature"] = self.signature
        return result


def aid_manifest_from_dict(s: Any) -> AidManifest:
    return AidManifest.from_dict(s)


def aid_manifest_to_dict(x: AidManifest) -> Any:
    return to_class(AidManifest, x)
