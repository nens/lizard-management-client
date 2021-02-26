import {appTiles} from './AppTileConfig';
import doArraysHaveEqualElement from '../utils/doArraysHaveEqualElement';
import arrayAmountOfIdenticallyOrderedItemsFromStart from '../utils/arrayAmountOfIdenticallyOrderedItemsFromStart';

const shouldRedirectBasedOnAuthorization = function (bootstrap:any, selectedOrganisation:any) {
  const urlSuffix = window.location.href.split("#")[1]
  // currentHomeAppTile is used to decide if the user has authorisation to be here or should be redirected
  // The tile you are currently on (have previously clicked on). Note: the user does not see this tile currently, but sees the screen it leads to.
  // For example if the user clicks on the tile that has 'linksTo: "/data_management/scenarios",' it will see the scenario list, 
  // but currentHomeAppTile is then actually the tile with 'linksTo: "/data_management/scenarios",'
  let currentHomeAppTile = appTiles.find(tile => {
    return urlSuffix === tile.linksTo
  });

  // if currentHomeAppTile is not found the user is on a screen further away removed from the tiles. For example on the screen: /data_management/scenarios/{uuid}
  // In that case the authorization from the closest by tile still applies. We need to find out which tile is closest by in a iteration
  if (!currentHomeAppTile) {
    appTiles.forEach(appTile=>{
      if (!currentHomeAppTile) {
        currentHomeAppTile = appTile;
      } else {
        const suffixItems = urlSuffix.split('/');
        const loopTileItems = appTile.linksTo.split('/');
        const existingTileItems = currentHomeAppTile.linksTo.split('/');
        if (arrayAmountOfIdenticallyOrderedItemsFromStart(suffixItems,loopTileItems) > arrayAmountOfIdenticallyOrderedItemsFromStart(suffixItems,existingTileItems)) {
          currentHomeAppTile = appTile
        }
      } 
    })
  }

  if (
    // only link back if it is not already the home page tile
    ((currentHomeAppTile && currentHomeAppTile.linksTo !== "/") || !currentHomeAppTile)  &&
    // only link back if the user is actually already autheniticated
    bootstrap && bootstrap.isAuthenticated &&
    selectedOrganisation &&
    !doArraysHaveEqualElement(((selectedOrganisation.roles) || []), (currentHomeAppTile && currentHomeAppTile.requiresOneOfRoles) || ["user", "manager", "supplier", "admin"])
    ) {
    return true;
  } else {
    return false;
  }
}

export default shouldRedirectBasedOnAuthorization;