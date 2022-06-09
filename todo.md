*** Add or edit raster results ***

- Add a new scenario - done

- Add plus button to scenario form for making new results - done

- Add functionality to plus button and connect to result form - done in 2 ways:

  1. plus button opens the result form in a modal:

    Advantage:
    - don't lose current changes to the scenario form
    - can know which result type to be created at the beginning

    Disadvantage:
    - form in a modal -> also already happened in the raster layer form -> is ok
    - the scenario form doesn't know of the newly created result so have to update the result list manually -> done
    - some adjustments need to be made to the result form (e.g. back button, save button, cancel button, form id)  -> done
  
  2. plus button redirects to the new result form page

    Advantage:
    - can reuse the result form without changing anything and is consistent with other places -> method 1 can also reuse the form mostly
    - after the save, it redirects back to the scenario form and the scenario already contained the newly created result -> method 1 can allow refetch manually after closing the modal

    Disadvantage:
    - current changes to the scenario form need to be saved first somehow -> quite problematic to solve
    - don't know which result type to be created -> cannot be solved

- Make result form with following fields:
  - id - ok
  - scenario --> source --> removed from API
  - raster --> link to connected raster_layer - ok -> better handling -> ok
  - attachment_url - not included
  - name - ok
  - code - ok
  - description - ok
  - family - ok
  - submit function - 1/2 way

- Link to raster layer from the result form - done
- Modal to confirm - done

- Test geoblock form / raster layer form / and form buttons - done