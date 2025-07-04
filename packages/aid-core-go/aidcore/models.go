// Code generated from JSON Schema using quicktype. DO NOT EDIT.
// To parse and unparse this JSON data, add this code to your project and do:
//
//    aidManifest, err := UnmarshalAidManifest(bytes)
//    bytes, err = aidManifest.Marshal()

package aidcore

import "bytes"
import "errors"

import "encoding/json"

func UnmarshalAidManifest(data []byte) (AidManifest, error) {
	var r AidManifest
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *AidManifest) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

// Canonical JSON configuration manifest for an Agent Interface Discovery (AID) profile.
// Version 1.
type AidManifest struct {
	Implementations []Implementation `json:"implementations"`
	Metadata        *Metadata        `json:"metadata,omitempty"`
	Name            string           `json:"name"`
	SchemaVersion   SchemaVersion    `json:"schemaVersion"`
	Signature       interface{}      `json:"signature"`
}

type Implementation struct {
	Authentication                                                       Authentication     `json:"authentication"`
	// A hint about supported MCP capabilities.                                             
	Capabilities                                                         *Capabilities      `json:"capabilities,omitempty"`
	Certificate                                                          *Certificate       `json:"certificate,omitempty"`
	// A non-binding hint of the MCP version supported, e.g. '2025-06-18'                   
	MCPVersion                                                           *string            `json:"mcpVersion,omitempty"`
	Name                                                                 string             `json:"name"`
	Protocol                                                             string             `json:"protocol"`
	RequiredConfig                                                       []RequiredConfig   `json:"requiredConfig,omitempty"`
	RequiredPaths                                                        []RequiredPath     `json:"requiredPaths,omitempty"`
	RevocationURL                                                        interface{}        `json:"revocationURL"`
	Status                                                               *Status            `json:"status,omitempty"`
	Tags                                                                 []string           `json:"tags,omitempty"`
	Title                                                                string             `json:"title"`
	Type                                                                 ImplementationType `json:"type"`
	URI                                                                  *string            `json:"uri,omitempty"`
	Execution                                                            *Execution         `json:"execution,omitempty"`
	Package                                                              *Package           `json:"package,omitempty"`
}

type Authentication struct {
	Scheme      Scheme       `json:"scheme"`
	Credentials []Credential `json:"credentials,omitempty"`
	Description *string      `json:"description,omitempty"`
	Placement   *Placement   `json:"placement,omitempty"`
	TokenURL    interface{}  `json:"tokenUrl"`
	Oauth       *Oauth       `json:"oauth,omitempty"`
}

type Credential struct {
	Description string `json:"description"`
	Key         string `json:"key"`
}

type Oauth struct {
	ClientID                                                             *string  `json:"clientId,omitempty"`
	// If true, signals support for RFC 7591 Dynamic Client Registration.         
	DynamicClientRegistration                                            *bool    `json:"dynamicClientRegistration,omitempty"`
	Scopes                                                               []string `json:"scopes,omitempty"`
}

type Placement struct {
	Format *string `json:"format,omitempty"`
	In     In      `json:"in"`
	Key    string  `json:"key"`
}

// A hint about supported MCP capabilities.
type Capabilities struct {
	ResourceLinks    *ResourceLinks    `json:"resourceLinks,omitempty"`
	StructuredOutput *StructuredOutput `json:"structuredOutput,omitempty"`
}

type ResourceLinks struct {
}

type StructuredOutput struct {
}

type Certificate struct {
	EnrollmentEndpoint interface{} `json:"enrollmentEndpoint"`
	Source             Source      `json:"source"`
}

type Execution struct {
	Args              []string           `json:"args"`
	Command           string             `json:"command"`
	PlatformOverrides *PlatformOverrides `json:"platformOverrides,omitempty"`
}

type PlatformOverrides struct {
	Linux   *Linux `json:"linux,omitempty"`
	Macos   *Linux `json:"macos,omitempty"`
	Windows *Linux `json:"windows,omitempty"`
}

type Linux struct {
	Args                                                          []string `json:"args,omitempty"`
	Command                                                       *string  `json:"command,omitempty"`
	// An optional content digest for a platform-specific package.         
	Digest                                                        *string  `json:"digest,omitempty"`
}

type Package struct {
	Digest     *string `json:"digest,omitempty"`
	Identifier string  `json:"identifier"`
	Manager    string  `json:"manager"`
}

type RequiredConfig struct {
	DefaultValue *DefaultValue      `json:"defaultValue"`
	Description  string             `json:"description"`
	Key          string             `json:"key"`
	Secret       *bool              `json:"secret,omitempty"`
	Type         RequiredConfigType `json:"type"`
}

type RequiredPath struct {
	Description string            `json:"description"`
	Key         string            `json:"key"`
	Type        *RequiredPathType `json:"type,omitempty"`
}

type Metadata struct {
	ContentVersion *string     `json:"contentVersion,omitempty"`
	Documentation  interface{} `json:"documentation"`
	RevocationURL  interface{} `json:"revocationURL"`
}

type In string

const (
	CLIArg In = "cli_arg"
	Header In = "header"
	Query  In = "query"
)

type Scheme string

const (
	Apikey        Scheme = "apikey"
	Basic         Scheme = "basic"
	Custom        Scheme = "custom"
	Mtls          Scheme = "mtls"
	None          Scheme = "none"
	Oauth2Code    Scheme = "oauth2_code"
	Oauth2Device  Scheme = "oauth2_device"
	Oauth2Service Scheme = "oauth2_service"
	Pat           Scheme = "pat"
)

type Source string

const (
	Enrollment Source = "enrollment"
	SourceFile Source = "file"
)

type RequiredConfigType string

const (
	Boolean RequiredConfigType = "boolean"
	Integer RequiredConfigType = "integer"
	String  RequiredConfigType = "string"
)

type RequiredPathType string

const (
	Directory RequiredPathType = "directory"
	TypeFile  RequiredPathType = "file"
)

type Status string

const (
	Active     Status = "active"
	Deprecated Status = "deprecated"
)

type ImplementationType string

const (
	Local  ImplementationType = "local"
	Remote ImplementationType = "remote"
)

type SchemaVersion string

const (
	The1 SchemaVersion = "1"
)

type DefaultValue struct {
	Bool   *bool
	Double *float64
	String *string
}

func (x *DefaultValue) UnmarshalJSON(data []byte) error {
	object, err := unmarshalUnion(data, nil, &x.Double, &x.Bool, &x.String, false, nil, false, nil, false, nil, false, nil, false)
	if err != nil {
		return err
	}
	if object {
	}
	return nil
}

func (x *DefaultValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(nil, x.Double, x.Bool, x.String, false, nil, false, nil, false, nil, false, nil, false)
}

func unmarshalUnion(data []byte, pi **int64, pf **float64, pb **bool, ps **string, haveArray bool, pa interface{}, haveObject bool, pc interface{}, haveMap bool, pm interface{}, haveEnum bool, pe interface{}, nullable bool) (bool, error) {
	if pi != nil {
			*pi = nil
	}
	if pf != nil {
			*pf = nil
	}
	if pb != nil {
			*pb = nil
	}
	if ps != nil {
			*ps = nil
	}

	dec := json.NewDecoder(bytes.NewReader(data))
	dec.UseNumber()
	tok, err := dec.Token()
	if err != nil {
			return false, err
	}

	switch v := tok.(type) {
	case json.Number:
			if pi != nil {
					i, err := v.Int64()
					if err == nil {
							*pi = &i
							return false, nil
					}
			}
			if pf != nil {
					f, err := v.Float64()
					if err == nil {
							*pf = &f
							return false, nil
					}
					return false, errors.New("Unparsable number")
			}
			return false, errors.New("Union does not contain number")
	case float64:
			return false, errors.New("Decoder should not return float64")
	case bool:
			if pb != nil {
					*pb = &v
					return false, nil
			}
			return false, errors.New("Union does not contain bool")
	case string:
			if haveEnum {
					return false, json.Unmarshal(data, pe)
			}
			if ps != nil {
					*ps = &v
					return false, nil
			}
			return false, errors.New("Union does not contain string")
	case nil:
			if nullable {
					return false, nil
			}
			return false, errors.New("Union does not contain null")
	case json.Delim:
			if v == '{' {
					if haveObject {
							return true, json.Unmarshal(data, pc)
					}
					if haveMap {
							return false, json.Unmarshal(data, pm)
					}
					return false, errors.New("Union does not contain object")
			}
			if v == '[' {
					if haveArray {
							return false, json.Unmarshal(data, pa)
					}
					return false, errors.New("Union does not contain array")
			}
			return false, errors.New("Cannot handle delimiter")
	}
	return false, errors.New("Cannot unmarshal union")
}

func marshalUnion(pi *int64, pf *float64, pb *bool, ps *string, haveArray bool, pa interface{}, haveObject bool, pc interface{}, haveMap bool, pm interface{}, haveEnum bool, pe interface{}, nullable bool) ([]byte, error) {
	if pi != nil {
			return json.Marshal(*pi)
	}
	if pf != nil {
			return json.Marshal(*pf)
	}
	if pb != nil {
			return json.Marshal(*pb)
	}
	if ps != nil {
			return json.Marshal(*ps)
	}
	if haveArray {
			return json.Marshal(pa)
	}
	if haveObject {
			return json.Marshal(pc)
	}
	if haveMap {
			return json.Marshal(pm)
	}
	if haveEnum {
			return json.Marshal(pe)
	}
	if nullable {
			return json.Marshal(nil)
	}
	return nil, errors.New("Union must not be null")
}
