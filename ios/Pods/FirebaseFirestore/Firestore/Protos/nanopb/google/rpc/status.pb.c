/*
 * Copyright 2018 Google
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* Automatically generated nanopb constant definitions */
/* Generated by nanopb-0.3.8 at Fri Feb  2 17:48:02 2018. */

#include "status.pb.h"

/* @@protoc_insertion_point(includes) */
#if PB_PROTO_HEADER_VERSION != 30
#error Regenerate this file with the current version of nanopb generator.
#endif



const pb_field_t google_rpc_Status_fields[4] = {
    PB_FIELD(  1, INT32   , SINGULAR, STATIC  , FIRST, google_rpc_Status, code, code, 0),
    PB_FIELD(  2, STRING  , SINGULAR, CALLBACK, OTHER, google_rpc_Status, message, code, 0),
    PB_FIELD(  3, MESSAGE , REPEATED, CALLBACK, OTHER, google_rpc_Status, details, message, &google_protobuf_Any_fields),
    PB_LAST_FIELD
};


/* @@protoc_insertion_point(eof) */
