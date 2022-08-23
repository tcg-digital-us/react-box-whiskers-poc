Create API Routes
*****************

To create our frontend app, we will require specific API calls. Thus far, we have created an app that displays the
status of Elasticsearch itself. Moving forward we will need to retrieve all documents in an index, as well as add
documents to an index.

Additionally, will also want to create indices to mess around with, as well as easily upload datasets to our indices
so that we don't have to add documents one-by-one (I hear there are tools to do this, but I couldn't find any that 
worked quickly and easily).

Finally, and while not specifically necessary, we will want to check the status of an index as well.

Below each API route has been defined, and code has been provided, with explanation where necessary. Each of these
routes need to be appended to ``index.js`` in the same manner as the ``/status`` route.

.. contents:: Minimal API Routes to Define:
   :local:
   :backlinks: top

----

.. include:: ./api/status.rst

----

.. include:: ./api/index.include