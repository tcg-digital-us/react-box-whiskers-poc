
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

.. contents:: Minimal API Routes Required:
   :depth: 3
   :local:
   :backlinks: none

.. include:: ./api/status.rst

----

.. include:: ./api/index.include