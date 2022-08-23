
Further Define the Backend API
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Now that we have a generic graph displayed using data retrieved from
Elasticsearch's 'status' call, we can change direction towards what we
are actually trying to accomplish. We need to use an actual dataset that
we can query data from that would be relevant in displaying to a box and
whiskers graph.

A freely available dataset that is perfect for our purposes is the
penguins dataset provided in the `vega-datasets repository`__. A copy of this JSON file is also
available in the repo under the ``res`` folder.

Given this, we will be developing some API ends that are required for
our visualisation, and some others that are just for ease of use. The
functionalites for ease of use will be denoted as such, and they won't
have in-depth explanations (though, feel free to go through their code
and understand why they do what they do).

.. _Penguins: https://github.com/vega/vega-datasets/blob/next/data/penguins.json

__ Penguins_

Demystifying the Elasticsearch Client
_____________________________________

Shortly after setting up Elasticsearch and messing around with the client API, it became
apparent that both API's require slightly different methods of execution. Of the two Resources
at the bottom of this page, I found that the Client API documentation didn't seem to list the JSON objects that need to 
be provided to the Client API calls, and this is important because most any Elasticsearch
API information that you will be able to find on the web is in regards to the
Elasticsearch binary's REST API documentation.

In this situation, the best way to figure out exactly what parameters we needed to provide to
the Client API, is to Ctrl-click whichever function call we are trying to make in order to check out its
definition in the Elasticsearch Client module, and then to continue Ctrl-click'ing on the Typescript 
parameter types defined for that function call, until eventually we reach the definition of the parameter object
that the Client API expects.

If you have been around a while, this may be old-hat and you can skip this section, but I will provide an example
below for people who haven't gotten their feet wet yet mucking around in other people's code.

Let's see what JSON parameters we need to provide if we are to make a call to the 
Client API to get the status of an index:

.. NOTE::

   *This method of Ctrl-click'ing through the source code should work with most modern
   IDE's, but if it doesn't work for you, then I recommend using Visual Studio Code.*

1. Let's say we wanted to implement a call in ``server.js`` to get the status of an index:

   .. code:: javascript

      client.indices.get()

2. The function call ``.get()`` requires some arguments, but we need to know what parameters/objects we should provide it. If we Ctrl+click
   on ``.get()``, we will be shown its Typescript definition (in this case there are three
   overloads of ``.get()`` available, one with options, and two more with options with/without metadata): 

   .. code:: javascript

      get(this: That, params: T.IndicesGetRequest | TB.IndicesGetRequest, options?: TransportRequestOptionsWithOutMeta): Promise<T.IndicesGetResponse>;
      get(this: That, params: T.IndicesGetRequest | TB.IndicesGetRequest, options?: TransportRequestOptionsWithMeta): Promise<TransportResult<T.IndicesGetResponse, unknown>>;
      get(this: That, params: T.IndicesGetRequest | TB.IndicesGetRequest, options?: TransportRequestOptions): Promise<T.IndicesGetResponse>;

3. We can see that all three function calls take three arguments:

   * A Typescript object reference pointing to the current instance calling the function.

   * The params object (of type T.IndicesGetRequest and
     TB.IndicesGetRequest) that contains the parameters Elasticsearch requires for our request. 
   
   * An options object (one of three types). The trailing questionmark
     ``options?`` denotes that this argument is optional. 
   
   Here we are interested in just the parameters, as the options mainly have only to do with the method of communication
   between our client and Elasticsearch, so we need to Ctrl+click the T.IndicesGetRequest type to see its type definition:

   .. code:: javascript

      export interface IndicesGetRequest extends RequestBase {
        index: Indices;
        allow_no_indices?: boolean;
        expand_wildcards?: ExpandWildcards;
        flat_settings?: boolean;
        ignore_unavailable?: boolean;
        include_defaults?: boolean;
        local?: boolean;
        master_timeout?: Time;
        features?: IndicesGetFeatures;
      }

4. At last, we see that can see that the ``IndicesGetRequest`` type has only one required parameter, ``index`` which can
   be a string or an array of strings (as defined by the Indices type). We can verify that this type and its 
   parameters make sense by checking the `Get index REST API for the Elasticsearch instance <https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-get-index.html>`_.
   The REST API for Get index shows that it takes one path parameter ``<target>`` that is the name of the index
   we want the status of, as well as other query parameters whose names reflect the rest of the parameters in 
   the ``IndicesGetRequest`` type. So to make our get request from step one, we can then add a JSON params object to the call 
   as an argument with the required index name:

   .. code:: javascript

      client.indices.get({ index: 'name_of_index' })...

   .. NOTE::

      *This is only for instructinoal purposes. In step two above, we see that the ``get`` function returns a promise so that will
      need to be handled accordingly.*

Now, lets continue on to defining our server API!

.. toctree::
   :maxdepth:  10
   :caption: Routes:
   :hidden:

   routes/routes

Resources
_________

* `Elasticsearch Rest API Documentation <https://www.elastic.co/guide/en/elasticsearch/reference/current/rest-apis.html>`_
* `Elasticsearch Client API Reference <https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html>`_


