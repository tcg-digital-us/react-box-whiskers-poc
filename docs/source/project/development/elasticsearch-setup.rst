
`<- Go Back.`__

.. _Back: ../development.html

__ Back_

Download and Manage an Elasticsearch Instance
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

At the time of writing this, the current binary version of Elasticsearch
available is v8.3.3. The platform download variants available are:

.. raw:: html

   <center>

======= ==================== =====================
\       AMD                  ARM
======= ==================== =====================
Windows windows-x86_64.zip   N/A
Mac     darwin-x86_64.tar.gz darwin-aarch64.tar.gz
Linux   linux-x86_64.tar.gz  linux-aarch64.tar.gz
Debian  amd64.deb            arm64.deb
RPM     x86_64.rpm           aarch64.rpm
======= ==================== =====================

.. raw:: html

   </center>

In this tutorial we will be working in the WSL2 environment on Windows,
so we will be using the linux variant for x86_64. Your environment may
differ, so choose the variant appropriate for your system and install it
accordingly.

Inside WSL we can run:

.. code:: bash

   $ cd ~/
   $ curl -O https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-8.3.3-linux-x86_64.tar.gz
   $ tar -xzvf elasticsearch-8.3.3-linux-x86_64.tar.gz
   $ cd ~/elasticsearch-8.3.3

After downloading it, we will run it once to configure it so that we can
get the password for the default 'elastic' user that is generated after
running.

.. code:: bash

   $ ./bin/elasticsearch

After you wait for Elasticsearch to fully initialize, you should see an
ouptut similar to this below:

.. code:: bash

   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ✅ Elasticsearch security features have been automatically configured!
   ✅ Authentication is enabled and cluster connections are encrypted.

   ℹ️  Password for the elastic user (reset with `bin/elasticsearch-reset-password -u elastic`):
     2halHiMGAkkLAig-bYi8

   ℹ️  HTTP CA certificate SHA-256 fingerprint:
     a62ded01ae5f23c34b1887a76ba8503bc3f96dea03255c733d87913506ab9083

   ℹ️  Configure Kibana to use this cluster:
   • Run Kibana and click the configuration link in the terminal when Kibana starts.
   • Copy the following enrollment token and paste it into Kibana in your browser (valid for the next 30 minutes):
     eyJ2ZXIiOiI4LjMuMyIsImFkciI6WyIxNzIuMTguMTkyLjIxMzo5MjAwIl0sImZnciI6ImE2MmRlZDAxYWU1ZjIzYzM0YjE4ODdhNzZiYTg1MDNiYzNmOTZkZWEwMzI1NWM3MzNkODc5MTM1MDZhYjkwODMiLCJrZXkiOiJHa1h1ZzRJQmp6a1JkU0pHbGdKcDpCRTlkdy11YVNCT2NaMFdYQnRLTlV3In0=

   ℹ️  Configure other nodes to join this cluster:
   • On this node:
     ⁃ Create an enrollment token with `bin/elasticsearch-create-enrollment-token -s node`.
     ⁃ Uncomment the transport.host setting at the end of config/elasticsearch.yml.
     ⁃ Restart Elasticsearch.
   • On other nodes:
     ⁃ Start Elasticsearch with `bin/elasticsearch --enrollment-token <token>`, using the enrollment token that you generated.
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Copy the 'password for the elastic user' and save it somewhere because
we will need it again later.

**Note:** *The password for the elastic user is only shown once upon
initial startup, so make sure you write it down!*

.. raw:: html

   <center>

`On to creating the backend ->`__

.. _Next: ./create-backend.html

__ Next_

.. raw:: html

   <center>
