(function(){
    var script = {
 "shadow": false,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "rootPlayer",
 "scrollBarMargin": 2,
 "children": [
  "this.MainViewer",
  "this.Container_7F59BED9_7065_6DCD_41D6_B4AD3EEA9174",
  "this.Container_062AB830_1140_E215_41AF_6C9D65345420",
  "this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15",
  "this.Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7",
  "this.Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41",
  "this.Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E",
  "this.Container_06C41BA5_1140_A63F_41AE_B0CBD78DEFDC",
  "this.Image_F6181AF8_D0C1_1CA4_41DB_DBCEA5FF7B38"
 ],
 "start": "this.init(); this.syncPlaylists([this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist,this.mainPlayList])",
 "class": "Player",
 "width": "100%",
 "defaultVRPointer": "laser",
 "scripts": {
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "unregisterKey": function(key){  delete window[key]; },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "registerKey": function(key, value){  window[key] = value; },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "getKey": function(key){  return window[key]; },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "existsKey": function(key){  return key in window; },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } }
 },
 "contentOpaque": false,
 "downloadEnabled": false,
 "minHeight": 20,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "minWidth": 20,
 "layout": "absolute",
 "borderRadius": 0,
 "borderSize": 0,
 "definitions": [{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -180,
  "class": "PanoramaCameraPosition",
  "pitch": -1.47
 },
 "id": "camera_E3A84EB5_D0C1_34AC_41E1_C6B40E155169",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_t.jpg",
   "left": {
    "levels": [
     {
      "url": "media/panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "Foto 24",
 "id": "panorama_DB74144C_D041_0BFC_41C8_08491C64A29F",
 "class": "Panorama",
 "overlays": [
  "this.overlay_F95817BB_D0C7_14A4_41D9_61B8B217BB79"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB7609FC_D041_1C9C_41C5_24A43569271A"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "hfovMin": "135%",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_t.jpg",
 "hfovMax": 130
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 87.43,
  "class": "PanoramaCameraPosition",
  "pitch": -1.47
 },
 "id": "camera_E402F364_D0C1_0DAC_41E9_2196A724EE5B",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_t.jpg",
   "left": {
    "levels": [
     {
      "url": "media/panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "Foto 06",
 "id": "panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A",
 "class": "Panorama",
 "overlays": [
  "this.overlay_C2D143B5_D043_0CAD_41E1_0160D850893B"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB7A023B_D041_0FA5_4191_326E556417C6"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "hfovMin": "135%",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_t.jpg",
 "hfovMax": 130
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -180,
  "class": "PanoramaCameraPosition",
  "pitch": 0.73
 },
 "id": "camera_E4AAD18A_D0C1_0D64_41E3_6C30A30CFB39",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_camera",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -180,
  "class": "PanoramaCameraPosition",
  "pitch": -2.94
 },
 "id": "camera_E35CB108_D0C1_0D64_41C9_7F3462FD2806",
 "automaticZoomSpeed": 10
},
{
 "displayMovements": [
  {
   "easing": "linear",
   "duration": 1000,
   "class": "TargetRotationalCameraDisplayMovement"
  },
  {
   "easing": "cubic_in_out",
   "targetPitch": 0,
   "targetStereographicFactor": 0,
   "duration": 3000,
   "class": "TargetRotationalCameraDisplayMovement"
  }
 ],
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "displayOriginPosition": {
  "stereographicFactor": 1,
  "hfov": 165,
  "yaw": 0,
  "class": "RotationalCameraDisplayPosition",
  "pitch": -90
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_camera",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -87.43,
  "class": "PanoramaCameraPosition",
  "pitch": 5.14
 },
 "id": "camera_E49811B7_D0C1_0CAC_41E6_8E8CE6934B07",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_t.jpg",
   "left": {
    "levels": [
     {
      "url": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "Foto 11",
 "id": "panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08",
 "class": "Panorama",
 "overlays": [
  "this.overlay_C70FB198_D041_0D64_41CB_B01948E8BFDD",
  "this.overlay_C7D4334E_D041_0DFC_41CC_99026476D7C8",
  "this.overlay_C7B6F159_D043_0DE5_41E9_F1DD585196E1"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB787525_D043_35AC_41E3_7A6B11BF6222"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "hfovMin": "135%",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_t.jpg",
 "hfovMax": 130
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_t.jpg",
   "left": {
    "levels": [
     {
      "url": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "Foto 15",
 "id": "panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D",
 "class": "Panorama",
 "overlays": [
  "this.overlay_CC09A2FA_D047_0CA4_41E5_3F19F85A0EFE",
  "this.overlay_CCCBE39F_D047_0C9C_41CE_2E79A987F48E",
  "this.overlay_CCE656C2_D046_F4E7_41E6_3CD934DD09D1"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "hfovMin": "135%",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_t.jpg",
 "hfovMax": 130
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -92.57,
  "class": "PanoramaCameraPosition",
  "pitch": -5.14
 },
 "id": "camera_E24A7E5C_D0C1_379C_41B3_B2E0E2FF881C",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -98.45,
  "class": "PanoramaCameraPosition",
  "pitch": -0.73
 },
 "id": "camera_E3308005_D0C1_0B6F_41DF_51140EEA9326",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 91.1,
  "class": "PanoramaCameraPosition",
  "pitch": -2.94
 },
 "id": "camera_E472B37A_D0C1_0DA7_41BD_95F012250B38",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_t.jpg",
   "left": {
    "levels": [
     {
      "url": "media/panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "Foto 04",
 "id": "panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30",
 "class": "Panorama",
 "overlays": [
  "this.overlay_C02430F8_D043_0CA3_41CD_44D09E534043",
  "this.overlay_C0D73D6F_D042_F5BC_41A6_FE3F8530393B"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB7A023B_D041_0FA5_4191_326E556417C6"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "hfovMin": "135%",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_t.jpg",
 "hfovMax": 130
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_t.jpg",
   "left": {
    "levels": [
     {
      "url": "media/panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "Foto 12",
 "id": "panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33",
 "class": "Panorama",
 "overlays": [
  "this.overlay_C881942E_D041_0BBC_41D0_01E5E538B4AE",
  "this.overlay_C97F08C9_D041_3CE4_41BD_6A03F0731F1E"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "hfovMin": "135%",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_t.jpg",
 "hfovMax": 130
},
{
 "items": [
  {
   "media": "this.panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_camera"
  },
  {
   "media": "this.panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_camera"
  },
  {
   "media": "this.panorama_DB79503F_D041_0B9B_41C4_7535E6897684",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB79503F_D041_0B9B_41C4_7535E6897684_camera"
  },
  {
   "media": "this.panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_camera"
  },
  {
   "media": "this.panorama_DB7A023B_D041_0FA5_4191_326E556417C6",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB7A023B_D041_0FA5_4191_326E556417C6_camera"
  },
  {
   "media": "this.panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 5, 6)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_camera"
  },
  {
   "media": "this.panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 6, 7)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_camera"
  },
  {
   "media": "this.panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 7, 8)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_camera"
  },
  {
   "media": "this.panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 8, 9)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_camera"
  },
  {
   "media": "this.panorama_DB787525_D043_35AC_41E3_7A6B11BF6222",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 9, 10)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_camera"
  },
  {
   "media": "this.panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 10, 11)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_camera"
  },
  {
   "media": "this.panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 11, 12)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_camera"
  },
  {
   "media": "this.panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 12, 13)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_camera"
  },
  {
   "media": "this.panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 13, 14)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_camera"
  },
  {
   "media": "this.panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 14, 15)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_camera"
  },
  {
   "media": "this.panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 15, 16)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_camera"
  },
  {
   "media": "this.panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 16, 17)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_camera"
  },
  {
   "media": "this.panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 17, 18)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_camera"
  },
  {
   "media": "this.panorama_DB79AA85_D043_1F6C_4181_305A69449F06",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 18, 19)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB79AA85_D043_1F6C_4181_305A69449F06_camera"
  },
  {
   "media": "this.panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 19, 20)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_camera"
  },
  {
   "media": "this.panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 20, 21)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_camera"
  },
  {
   "media": "this.panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 21, 22)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_camera"
  },
  {
   "media": "this.panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 22, 23)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_camera"
  },
  {
   "media": "this.panorama_DB74144C_D041_0BFC_41C8_08491C64A29F",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 23, 24)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_camera"
  },
  {
   "media": "this.panorama_DB7609FC_D041_1C9C_41C5_24A43569271A",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 24, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_camera"
  }
 ],
 "id": "ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist",
 "class": "PlayList"
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_camera",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -180,
  "class": "PanoramaCameraPosition",
  "pitch": -2.2
 },
 "id": "camera_E43302E8_D0C1_0CA4_41D8_E8F0020243C9",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 80.82,
  "class": "PanoramaCameraPosition",
  "pitch": 0.73
 },
 "id": "camera_E34CE135_D0C1_0DAC_41D8_085D4EDD4CFF",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_DB7A023B_D041_0FA5_4191_326E556417C6_camera",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_t.jpg",
   "left": {
    "levels": [
     {
      "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "Foto 05",
 "id": "panorama_DB7A023B_D041_0FA5_4191_326E556417C6",
 "class": "Panorama",
 "overlays": [
  "this.overlay_C08B8CA6_D04F_34AF_41D6_2CEC293D734A",
  "this.overlay_C13F0932_D04F_1DA4_41D1_6EDD11F486CB",
  "this.overlay_C1A7E8D2_D04F_1CE4_41E1_D0F255629E39",
  "this.overlay_C5808B44_D05E_FDEC_41E8_CF4B21A845A1"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "hfovMin": "135%",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_t.jpg",
 "hfovMax": 130
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_camera",
 "automaticZoomSpeed": 10
},
{
 "items": [
  {
   "media": "this.panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_camera"
  },
  {
   "media": "this.panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_camera"
  },
  {
   "media": "this.panorama_DB79503F_D041_0B9B_41C4_7535E6897684",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB79503F_D041_0B9B_41C4_7535E6897684_camera"
  },
  {
   "media": "this.panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_camera"
  },
  {
   "media": "this.panorama_DB7A023B_D041_0FA5_4191_326E556417C6",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB7A023B_D041_0FA5_4191_326E556417C6_camera"
  },
  {
   "media": "this.panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_camera"
  },
  {
   "media": "this.panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_camera"
  },
  {
   "media": "this.panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 8)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_camera"
  },
  {
   "media": "this.panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 8, 9)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_camera"
  },
  {
   "media": "this.panorama_DB787525_D043_35AC_41E3_7A6B11BF6222",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 9, 10)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_camera"
  },
  {
   "media": "this.panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 10, 11)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_camera"
  },
  {
   "media": "this.panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 11, 12)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_camera"
  },
  {
   "media": "this.panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 12, 13)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_camera"
  },
  {
   "media": "this.panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 13, 14)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_camera"
  },
  {
   "media": "this.panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 14, 15)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_camera"
  },
  {
   "media": "this.panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 15, 16)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_camera"
  },
  {
   "media": "this.panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 16, 17)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_camera"
  },
  {
   "media": "this.panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 17, 18)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_camera"
  },
  {
   "media": "this.panorama_DB79AA85_D043_1F6C_4181_305A69449F06",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 18, 19)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB79AA85_D043_1F6C_4181_305A69449F06_camera"
  },
  {
   "media": "this.panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 19, 20)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_camera"
  },
  {
   "media": "this.panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 20, 21)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_camera"
  },
  "this.PanoramaPlayListItem_E21CAD83_D0C1_3564_41DD_987799902460",
  {
   "media": "this.panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 22, 23)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_camera"
  },
  "this.PanoramaPlayListItem_E21C2D88_D0C1_3564_41E1_85CF605CD511",
  {
   "media": "this.panorama_DB7609FC_D041_1C9C_41C5_24A43569271A",
   "end": "this.trigger('tourEnded')",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 24, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_camera"
  }
 ],
 "id": "mainPlayList",
 "class": "PlayList"
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_camera",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_DB79503F_D041_0B9B_41C4_7535E6897684_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB79503F_D041_0B9B_41C4_7535E6897684_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB79503F_D041_0B9B_41C4_7535E6897684_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB79503F_D041_0B9B_41C4_7535E6897684_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_DB79503F_D041_0B9B_41C4_7535E6897684_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB79503F_D041_0B9B_41C4_7535E6897684_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB79503F_D041_0B9B_41C4_7535E6897684_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB79503F_D041_0B9B_41C4_7535E6897684_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_DB79503F_D041_0B9B_41C4_7535E6897684_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB79503F_D041_0B9B_41C4_7535E6897684_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB79503F_D041_0B9B_41C4_7535E6897684_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB79503F_D041_0B9B_41C4_7535E6897684_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_DB79503F_D041_0B9B_41C4_7535E6897684_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB79503F_D041_0B9B_41C4_7535E6897684_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB79503F_D041_0B9B_41C4_7535E6897684_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB79503F_D041_0B9B_41C4_7535E6897684_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_DB79503F_D041_0B9B_41C4_7535E6897684_t.jpg",
   "left": {
    "levels": [
     {
      "url": "media/panorama_DB79503F_D041_0B9B_41C4_7535E6897684_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB79503F_D041_0B9B_41C4_7535E6897684_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB79503F_D041_0B9B_41C4_7535E6897684_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB79503F_D041_0B9B_41C4_7535E6897684_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_DB79503F_D041_0B9B_41C4_7535E6897684_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB79503F_D041_0B9B_41C4_7535E6897684_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB79503F_D041_0B9B_41C4_7535E6897684_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB79503F_D041_0B9B_41C4_7535E6897684_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "Foto 03",
 "id": "panorama_DB79503F_D041_0B9B_41C4_7535E6897684",
 "class": "Panorama",
 "overlays": [
  "this.overlay_DF8157AD_D043_14BC_41DC_691F17AD4606"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "hfovMin": "135%",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_DB79503F_D041_0B9B_41C4_7535E6897684_t.jpg",
 "hfovMax": 130
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_camera",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 99.92,
  "class": "PanoramaCameraPosition",
  "pitch": 0.73
 },
 "id": "camera_E4F7B23A_D0C1_0FA7_41D8_634EF97F08F2",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_DB79503F_D041_0B9B_41C4_7535E6897684_camera",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_t.jpg",
   "left": {
    "levels": [
     {
      "url": "media/panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "Foto 16",
 "id": "panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E",
 "class": "Panorama",
 "overlays": [
  "this.overlay_CDD0A475_D043_0BAC_41E0_C564C6F6DF7B",
  "this.overlay_CD9AC247_D043_0FEC_41B7_5A1EA83689A7"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "hfovMin": "135%",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_t.jpg",
 "hfovMax": 130
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_t.jpg",
   "left": {
    "levels": [
     {
      "url": "media/panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "Foto 22",
 "id": "panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7",
 "class": "Panorama",
 "overlays": [
  "this.overlay_F9EF8CF9_D0C6_F4A4_41AA_DB7E3B1436B6"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "hfovMin": "135%",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_t.jpg",
 "hfovMax": 130
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_DB79AA85_D043_1F6C_4181_305A69449F06_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB79AA85_D043_1F6C_4181_305A69449F06_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB79AA85_D043_1F6C_4181_305A69449F06_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB79AA85_D043_1F6C_4181_305A69449F06_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_DB79AA85_D043_1F6C_4181_305A69449F06_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB79AA85_D043_1F6C_4181_305A69449F06_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB79AA85_D043_1F6C_4181_305A69449F06_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB79AA85_D043_1F6C_4181_305A69449F06_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_DB79AA85_D043_1F6C_4181_305A69449F06_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB79AA85_D043_1F6C_4181_305A69449F06_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB79AA85_D043_1F6C_4181_305A69449F06_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB79AA85_D043_1F6C_4181_305A69449F06_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_DB79AA85_D043_1F6C_4181_305A69449F06_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB79AA85_D043_1F6C_4181_305A69449F06_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB79AA85_D043_1F6C_4181_305A69449F06_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB79AA85_D043_1F6C_4181_305A69449F06_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_DB79AA85_D043_1F6C_4181_305A69449F06_t.jpg",
   "left": {
    "levels": [
     {
      "url": "media/panorama_DB79AA85_D043_1F6C_4181_305A69449F06_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB79AA85_D043_1F6C_4181_305A69449F06_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB79AA85_D043_1F6C_4181_305A69449F06_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB79AA85_D043_1F6C_4181_305A69449F06_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_DB79AA85_D043_1F6C_4181_305A69449F06_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB79AA85_D043_1F6C_4181_305A69449F06_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB79AA85_D043_1F6C_4181_305A69449F06_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB79AA85_D043_1F6C_4181_305A69449F06_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "Foto 19",
 "id": "panorama_DB79AA85_D043_1F6C_4181_305A69449F06",
 "class": "Panorama",
 "overlays": [
  "this.overlay_F093273F_D043_759C_41DB_B1F7612CEDED",
  "this.overlay_F1484DF0_D043_14A3_41E6_BE39C509BC23"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "hfovMin": "135%",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_DB79AA85_D043_1F6C_4181_305A69449F06_t.jpg",
 "hfovMax": 130
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_DB79AA85_D043_1F6C_4181_305A69449F06_camera",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -180,
  "class": "PanoramaCameraPosition",
  "pitch": 4.41
 },
 "id": "camera_E487B20D_D0C1_0F7D_4192_9EB9D3615C64",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -180,
  "class": "PanoramaCameraPosition",
  "pitch": 0.73
 },
 "id": "camera_E4E7C267_D0C1_0FAD_41E4_D3A9FD311D99",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -100.65,
  "class": "PanoramaCameraPosition",
  "pitch": -2.94
 },
 "id": "camera_E3962F07_D0C1_356C_41CE_D08532D0C123",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_camera",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -180,
  "class": "PanoramaCameraPosition",
  "pitch": -11.02
 },
 "id": "camera_E25B1E2F_D0C1_37BB_41E0_B4FCE86907E7",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 87.43,
  "class": "PanoramaCameraPosition",
  "pitch": -2.2
 },
 "id": "camera_E3E4CF82_D0C1_3564_41E5_7D4D6C6C75B5",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 97.71,
  "class": "PanoramaCameraPosition",
  "pitch": -3.67
 },
 "id": "camera_E26D9E08_D0C1_3764_41E6_296CB26D0A58",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_camera",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -83.02,
  "class": "PanoramaCameraPosition",
  "pitch": -8.08
 },
 "id": "camera_E31F605A_D0C1_0BE5_41D2_7B92403BD7EA",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_camera",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -180,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_E3C2AFDD_D0C1_349C_41B2_FA8C0D4B1366",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 85.96,
  "class": "PanoramaCameraPosition",
  "pitch": 4.41
 },
 "id": "camera_E32F7030_D0C1_0BA4_41DB_E51531533F80",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_t.jpg",
   "left": {
    "levels": [
     {
      "url": "media/panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "Foto 14",
 "id": "panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A",
 "class": "Panorama",
 "overlays": [
  "this.overlay_CB7B6E7B_D041_17A4_41CC_E1D05E1FC818",
  "this.overlay_CBFA60B7_D041_0CAC_41E3_67B19D77C491"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "hfovMin": "135%",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_t.jpg",
 "hfovMax": 130
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 77.14,
  "class": "PanoramaCameraPosition",
  "pitch": -2.2
 },
 "id": "camera_E4602391_D0C1_0D65_41E3_9C589F8A6691",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_camera",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_t.jpg",
   "left": {
    "levels": [
     {
      "url": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "Foto 09",
 "id": "panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74",
 "class": "Panorama",
 "overlays": [
  "this.overlay_C429A935_D041_7DAC_41D5_130818EDB5A2",
  "this.overlay_C4D0A863_D041_3BA4_41DD_4FC52B77E294",
  "this.overlay_C48D6FC5_D041_14EC_41E5_B8EE8FC0824B"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "hfovMin": "135%",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_t.jpg",
 "hfovMax": 130
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_t.jpg",
   "left": {
    "levels": [
     {
      "url": "media/panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "Foto 18",
 "id": "panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A",
 "class": "Panorama",
 "overlays": [
  "this.overlay_CFD50FFF_D041_149D_41DD_2ABA5CB162A6",
  "this.overlay_CF98E58F_D041_357C_41E8_60A57A0D9831"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB79AA85_D043_1F6C_4181_305A69449F06"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "hfovMin": "135%",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_t.jpg",
 "hfovMax": 130
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_camera",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_t.jpg",
   "left": {
    "levels": [
     {
      "url": "media/panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "Foto 20",
 "id": "panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB",
 "class": "Panorama",
 "overlays": [
  "this.overlay_F1FD2D08_D041_1564_41DD_60A549B59E44",
  "this.overlay_F1B2AC47_D041_3BEC_41E5_B506D3FA52F3"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB79AA85_D043_1F6C_4181_305A69449F06"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "hfovMin": "135%",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_t.jpg",
 "hfovMax": 130
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -180,
  "class": "PanoramaCameraPosition",
  "pitch": 2.94
 },
 "id": "camera_E48861E4_D0C1_0CAC_41D2_ED5376021848",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -180,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_E30E9087_D0C1_0B6C_41DA_057E49243F04",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_t.jpg",
   "left": {
    "levels": [
     {
      "url": "media/panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "Foto 23",
 "id": "panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434",
 "class": "Panorama",
 "overlays": [
  "this.overlay_FCB5939A_D0C1_0D64_41DD_FF6B3DB88064"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "hfovMin": "135%",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_t.jpg",
 "hfovMax": 130
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -180,
  "class": "PanoramaCameraPosition",
  "pitch": 1.47
 },
 "id": "camera_E3861F32_D0C1_35A7_41D8_AEA9DECC23DF",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -25.71,
  "class": "PanoramaCameraPosition",
  "pitch": 1.47
 },
 "id": "camera_E3B85E88_D0C1_3764_41D1_3863BE85CB09",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_t.jpg",
   "left": {
    "levels": [
     {
      "url": "media/panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "Foto 17",
 "id": "panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA",
 "class": "Panorama",
 "overlays": [
  "this.overlay_CE7BED34_D07E_F5AC_41C3_5A5B341B3655",
  "this.overlay_CECE42DD_D07F_0C9C_41E0_B2007FBB88B9"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "hfovMin": "135%",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_t.jpg",
 "hfovMax": 130
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -91.1,
  "class": "PanoramaCameraPosition",
  "pitch": -2.2
 },
 "id": "camera_E4234315_D0C1_0D6C_41C0_67057F418EA2",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_camera",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 94.04,
  "class": "PanoramaCameraPosition",
  "pitch": -8.08
 },
 "id": "camera_E412E340_D0C1_0DE4_41C4_8021407928BC",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_t.jpg",
   "left": {
    "levels": [
     {
      "url": "media/panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "Foto 10",
 "id": "panorama_DB787525_D043_35AC_41E3_7A6B11BF6222",
 "class": "Panorama",
 "overlays": [
  "this.overlay_C65CA86B_D05F_1BA5_41C2_08671513530F",
  "this.overlay_C62E15A9_D05F_14A4_41E3_0BB323C14C6E"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "hfovMin": "135%",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_t.jpg",
 "hfovMax": 130
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -95.51,
  "class": "PanoramaCameraPosition",
  "pitch": 0.73
 },
 "id": "camera_E4D52293_D0C1_0F64_41C6_896C1BE4C7B7",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_camera",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 82.29,
  "class": "PanoramaCameraPosition",
  "pitch": 0.73
 },
 "id": "camera_E36CC0DD_D0C1_0C9D_41DE_6020364361EC",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_t.jpg",
   "left": {
    "levels": [
     {
      "url": "media/panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "Foto 21",
 "id": "panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3",
 "class": "Panorama",
 "overlays": [
  "this.overlay_F289EDA6_D047_14AC_41DE_74A6DB5DDBE5"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "hfovMin": "135%",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_t.jpg",
 "hfovMax": 130
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_camera",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -98.45,
  "class": "PanoramaCameraPosition",
  "pitch": -10.29
 },
 "id": "camera_E4BA215D_D0C1_0D9C_41AC_F00CC4EE7BAB",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_camera",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 180,
  "class": "PanoramaCameraPosition",
  "pitch": -6.61
 },
 "id": "camera_E3A7BEDD_D0C1_349C_41E2_22915D3A7AE9",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_t.jpg",
   "left": {
    "levels": [
     {
      "url": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "Foto 08",
 "id": "panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B",
 "class": "Panorama",
 "overlays": [
  "this.overlay_C315C1CB_D047_0CE4_41D9_A00CE5ACED65",
  "this.overlay_C3D17B88_D047_7D64_41E0_B4B6AD07AB1C",
  "this.overlay_C5092A22_D041_1FA4_41DF_DB7DFBC920D3"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB7A023B_D041_0FA5_4191_326E556417C6"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB787525_D043_35AC_41E3_7A6B11BF6222"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "hfovMin": "135%",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_t.jpg",
 "hfovMax": 130
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_t.jpg",
   "left": {
    "levels": [
     {
      "url": "media/panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "Foto 25",
 "id": "panorama_DB7609FC_D041_1C9C_41C5_24A43569271A",
 "class": "Panorama",
 "overlays": [
  "this.overlay_FA85799C_D0C1_1D63_41B8_701C9B1EEF9B"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB74144C_D041_0BFC_41C8_08491C64A29F"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "hfovMin": "135%",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_t.jpg",
 "hfovMax": 130
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_camera",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_camera",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_camera",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_camera",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_t.jpg",
   "left": {
    "levels": [
     {
      "url": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "Foto 02",
 "id": "panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E",
 "class": "Panorama",
 "overlays": [
  "this.overlay_DEC20D50_D047_15E4_41DE_99B83D1F39DA",
  "this.overlay_DE9FD8AE_D047_3CBC_41C6_77FCC1A6A19F",
  "this.overlay_DF082406_D041_0B6F_41D6_FDCBFD8FA2D4"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB79503F_D041_0B9B_41C4_7535E6897684"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "hfovMin": "135%",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_t.jpg",
 "hfovMax": 130
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_t.jpg",
   "left": {
    "levels": [
     {
      "url": "media/panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "Foto 07",
 "id": "panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC",
 "class": "Panorama",
 "overlays": [
  "this.overlay_C2E35488_D041_0B64_41C9_A5A68377EB70",
  "this.overlay_C2A3EDCA_D041_34E4_41CD_D6037E9F7D19"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB7A023B_D041_0FA5_4191_326E556417C6"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "hfovMin": "135%",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_t.jpg",
 "hfovMax": 130
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_camera",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_camera",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -167.51,
  "class": "PanoramaCameraPosition",
  "pitch": -10.29
 },
 "id": "camera_E4C5C2BB_D0C1_0CA4_41DD_6D7A154A1BAF",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_t.jpg",
   "left": {
    "levels": [
     {
      "url": "media/panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "Foto 01",
 "id": "panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74",
 "class": "Panorama",
 "overlays": [
  "this.overlay_DDA5C7DD_D047_349D_41C1_925595C3262B"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "hfovMin": "135%",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_t.jpg",
 "hfovMax": 130
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_t.jpg",
   "left": {
    "levels": [
     {
      "url": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "class": "TiledImageResourceLevel",
      "width": 2560,
      "tags": "ondemand",
      "rowCount": 5,
      "height": 2560
     },
     {
      "url": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "Foto 13",
 "id": "panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D",
 "class": "Panorama",
 "overlays": [
  "this.overlay_C9ABFE65_D041_17AD_41CB_5D93CF38F6C9",
  "this.overlay_CA43F617_D041_176C_41C8_9AB008D79223",
  "this.overlay_CA3B2DC2_D041_14E4_41D3_AEE403CA26DC"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "hfovMin": "135%",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_t.jpg",
 "hfovMax": 130
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -180,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "camera_E3D2FFAF_D0C1_34BC_41E8_46DAC59CAF20",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "id": "panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_camera",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -91.1,
  "class": "PanoramaCameraPosition",
  "pitch": -8.82
 },
 "id": "camera_E37E80AF_D0C1_0CBD_41E4_2991499B4465",
 "automaticZoomSpeed": 10
},
{
 "viewerArea": "this.MainViewer",
 "displayPlaybackBar": true,
 "class": "PanoramaPlayer",
 "touchControlMode": "drag_rotation",
 "gyroscopeVerticalDraggingEnabled": true,
 "id": "MainViewerPanoramaPlayer",
 "mouseControlMode": "drag_rotation"
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": 63.18,
  "class": "PanoramaCameraPosition",
  "pitch": -6.61
 },
 "id": "camera_E3F43F58_D0C1_3598_41DA_D849A9A08C8A",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "initialPosition": {
  "yaw": -88.9,
  "class": "PanoramaCameraPosition",
  "pitch": -3.67
 },
 "id": "camera_E27DEDDB_D0C1_34E5_41E9_7D761E79CA8C",
 "automaticZoomSpeed": 10
},
{
 "playbackBarHeight": 10,
 "toolTipFontSize": 13,
 "id": "MainViewer",
 "left": 0,
 "playbackBarBackgroundColorDirection": "vertical",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "toolTipTextShadowColor": "#000000",
 "class": "ViewerArea",
 "width": "100%",
 "toolTipFontWeight": "normal",
 "toolTipTextShadowBlurRadius": 3,
 "toolTipPaddingBottom": 7,
 "progressBarBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "playbackBarRight": 0,
 "playbackBarProgressBorderSize": 0,
 "minHeight": 50,
 "playbackBarHeadShadowVerticalLength": 0,
 "playbackBarBorderRadius": 0,
 "transitionDuration": 500,
 "paddingRight": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderRadius": 0,
 "height": "100%",
 "toolTipFontStyle": "normal",
 "minWidth": 100,
 "borderSize": 0,
 "progressLeft": 0,
 "playbackBarHeadBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipShadowOpacity": 0,
 "propagateClick": true,
 "toolTipTextShadowOpacity": 0,
 "vrPointerSelectionColor": "#FF6600",
 "toolTipFontFamily": "Georgia",
 "playbackBarBorderSize": 0,
 "playbackBarBackgroundOpacity": 1,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarHeadShadowColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "firstTransitionDuration": 0,
 "paddingLeft": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "progressOpacity": 1,
 "progressBottom": 0,
 "toolTipBackgroundColor": "#000000",
 "toolTipFontColor": "#FFFFFF",
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "displayTooltipInTouchScreens": true,
 "playbackBarHeadShadowOpacity": 0.7,
 "vrPointerColor": "#FFFFFF",
 "transitionMode": "blending",
 "progressBarOpacity": 1,
 "playbackBarBorderColor": "#FFFFFF",
 "toolTipBorderSize": 1,
 "toolTipPaddingRight": 10,
 "progressBorderSize": 0,
 "toolTipPaddingLeft": 10,
 "toolTipPaddingTop": 7,
 "toolTipDisplayTime": 600,
 "progressBorderRadius": 0,
 "top": 0,
 "progressBackgroundColorRatios": [
  0.01
 ],
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarLeft": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "paddingTop": 0,
 "progressBarBorderColor": "#0066FF",
 "paddingBottom": 0,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadOpacity": 1,
 "playbackBarBottom": 5,
 "progressBackgroundColorDirection": "vertical",
 "toolTipShadowSpread": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipBorderColor": "#767676",
 "progressBorderColor": "#FFFFFF",
 "shadow": false,
 "data": {
  "name": "Main Viewer"
 },
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipShadowBlurRadius": 3,
 "toolTipOpacity": 0.5
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "children": [
  "this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D",
  "this.Container_7DB20382_7065_343F_4186_6E0B0B3AFF36"
 ],
 "id": "Container_7F59BED9_7065_6DCD_41D6_B4AD3EEA9174",
 "left": "0%",
 "scrollBarMargin": 2,
 "width": 300,
 "class": "Container",
 "layout": "absolute",
 "contentOpaque": false,
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "top": "0%",
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "--- LEFT PANEL"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "Container_062AB830_1140_E215_41AF_6C9D65345420",
 "left": "0%",
 "scrollBarMargin": 2,
 "children": [
  "this.Container_062A782F_1140_E20B_41AF_B3E5DE341773",
  "this.Container_062A9830_1140_E215_41A7_5F2BBE5C20E4"
 ],
 "class": "Container",
 "layout": "absolute",
 "contentOpaque": false,
 "right": "0%",
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "bottom": "0%",
 "top": "0%",
 "backgroundOpacity": 0.6,
 "minWidth": 1,
 "creationPolicy": "inAdvance",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "borderSize": 0,
 "borderRadius": 0,
 "paddingTop": 0,
 "propagateClick": true,
 "paddingBottom": 0,
 "gap": 10,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "click": "this.setComponentVisibility(this.Container_062AB830_1140_E215_41AF_6C9D65345420, false, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "data": {
  "name": "--INFO photo"
 },
 "scrollBarOpacity": 0.5,
 "visible": false,
 "overflow": "scroll",
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15",
 "left": "0%",
 "scrollBarMargin": 2,
 "children": [
  "this.Container_39A197B1_0C06_62AF_419A_D15E4DDD2528"
 ],
 "class": "Container",
 "layout": "absolute",
 "contentOpaque": false,
 "right": "0%",
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "bottom": "0%",
 "top": "0%",
 "backgroundOpacity": 0.6,
 "minWidth": 1,
 "creationPolicy": "inAdvance",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "borderSize": 0,
 "borderRadius": 0,
 "paddingTop": 0,
 "propagateClick": true,
 "paddingBottom": 0,
 "gap": 10,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "click": "this.setComponentVisibility(this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15, false, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "data": {
  "name": "--PANORAMA LIST"
 },
 "scrollBarOpacity": 0.5,
 "visible": false,
 "overflow": "scroll",
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7",
 "left": "0%",
 "scrollBarMargin": 2,
 "children": [
  "this.Container_221C1648_0C06_E5FD_4180_8A2E8B66315E",
  "this.Container_221B3648_0C06_E5FD_4199_FCE031AE003B"
 ],
 "class": "Container",
 "layout": "absolute",
 "contentOpaque": false,
 "right": "0%",
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "bottom": "0%",
 "top": "0%",
 "backgroundOpacity": 0.6,
 "minWidth": 1,
 "creationPolicy": "inAdvance",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "borderSize": 0,
 "borderRadius": 0,
 "paddingTop": 0,
 "propagateClick": true,
 "paddingBottom": 0,
 "gap": 10,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "click": "this.setComponentVisibility(this.Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7, false, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "data": {
  "name": "--LOCATION"
 },
 "scrollBarOpacity": 0.5,
 "visible": false,
 "overflow": "scroll",
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41",
 "left": "0%",
 "scrollBarMargin": 2,
 "children": [
  "this.Container_2F8A6686_0D4F_6B71_4174_A02FE43588D3"
 ],
 "class": "Container",
 "layout": "absolute",
 "contentOpaque": false,
 "right": "0%",
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "bottom": "0%",
 "top": "0%",
 "backgroundOpacity": 0.6,
 "minWidth": 1,
 "creationPolicy": "inAdvance",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "borderSize": 0,
 "borderRadius": 0,
 "paddingTop": 0,
 "propagateClick": true,
 "paddingBottom": 0,
 "gap": 10,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "click": "this.setComponentVisibility(this.Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41, false, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "data": {
  "name": "--FLOORPLAN"
 },
 "scrollBarOpacity": 0.5,
 "visible": false,
 "overflow": "scroll",
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E",
 "left": "0%",
 "scrollBarMargin": 2,
 "children": [
  "this.Container_2A193C4C_0D3B_DFF0_4161_A2CD128EF536"
 ],
 "class": "Container",
 "layout": "absolute",
 "contentOpaque": false,
 "right": "0%",
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "bottom": "0%",
 "top": "0%",
 "backgroundOpacity": 0.6,
 "minWidth": 1,
 "creationPolicy": "inAdvance",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "borderSize": 0,
 "borderRadius": 0,
 "paddingTop": 0,
 "propagateClick": true,
 "paddingBottom": 0,
 "gap": 10,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "click": "this.setComponentVisibility(this.Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E, false, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "data": {
  "name": "--PHOTOALBUM"
 },
 "scrollBarOpacity": 0.5,
 "visible": false,
 "overflow": "scroll",
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "Container_06C41BA5_1140_A63F_41AE_B0CBD78DEFDC",
 "left": "0%",
 "scrollBarMargin": 2,
 "children": [
  "this.Container_06C5DBA5_1140_A63F_41AD_1D83A33F1255",
  "this.Container_06C43BA5_1140_A63F_41A1_96DC8F4CAD2F"
 ],
 "class": "Container",
 "layout": "absolute",
 "contentOpaque": false,
 "right": "0%",
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "bottom": "0%",
 "top": "0%",
 "backgroundOpacity": 0.6,
 "minWidth": 1,
 "creationPolicy": "inAdvance",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "borderSize": 0,
 "borderRadius": 0,
 "paddingTop": 0,
 "propagateClick": true,
 "paddingBottom": 0,
 "gap": 10,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#04A3E1",
 "click": "this.setComponentVisibility(this.Container_06C41BA5_1140_A63F_41AE_B0CBD78DEFDC, false, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "data": {
  "name": "--REALTOR"
 },
 "scrollBarOpacity": 0.5,
 "visible": false,
 "overflow": "scroll",
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "center",
 "maxHeight": 976,
 "maxWidth": 1229,
 "id": "Image_F6181AF8_D0C1_1CA4_41DB_DBCEA5FF7B38",
 "width": "17.033%",
 "class": "Image",
 "right": "0%",
 "url": "skin/Image_F6181AF8_D0C1_1CA4_41DB_DBCEA5FF7B38.png",
 "minHeight": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "top": "0%",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "26.638%",
 "paddingBottom": 0,
 "scaleMode": "fit_inside",
 "data": {
  "name": "Image37691"
 },
 "paddingLeft": 0
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_0_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 95.79,
   "hfov": 29.45,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -25.94
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB7609FC_D041_1C9C_41C5_24A43569271A, this.camera_E4F7B23A_D0C1_0FA7_41D8_634EF97F08F2); this.mainPlayList.set('selectedIndex', 24)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_E0D3C69C_D0C3_749C_41E6_67AD78FD7A67",
   "yaw": 95.79,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -25.94,
   "hfov": 29.45,
   "distance": 100
  }
 ],
 "id": "overlay_F95817BB_D0C7_14A4_41D9_61B8B217BB79",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 83.79,
   "hfov": 27.94,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -31.44
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB7A023B_D041_0FA5_4191_326E556417C6, this.camera_E34CE135_D0C1_0DAC_41D8_085D4EDD4CFF); this.mainPlayList.set('selectedIndex', 4)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBDB099C_D041_1D63_41E5_1816E8DF0578",
   "yaw": 83.79,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -31.44,
   "hfov": 27.94,
   "distance": 100
  }
 ],
 "id": "overlay_C2D143B5_D043_0CAD_41E1_0160D850893B",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -179.43,
   "hfov": 29.36,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -26.29
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB787525_D043_35AC_41E3_7A6B11BF6222, this.camera_E3861F32_D0C1_35A7_41D8_AEA9DECC23DF); this.mainPlayList.set('selectedIndex', 9)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD939A0_D041_1CA3_41E6_13303869868B",
   "yaw": -179.43,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -26.29,
   "hfov": 29.36,
   "distance": 100
  }
 ],
 "id": "overlay_C70FB198_D041_0D64_41CB_B01948E8BFDD",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 86.54,
   "hfov": 29.19,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -26.97
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D, this.camera_E3F43F58_D0C1_3598_41DA_D849A9A08C8A); this.mainPlayList.set('selectedIndex', 12)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD999A0_D041_1CA3_41E6_AF685CEDFE18",
   "yaw": 86.54,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -26.97,
   "hfov": 29.19,
   "distance": 100
  }
 ],
 "id": "overlay_C7D4334E_D041_0DFC_41CC_99026476D7C8",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_1_HS_2_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -3.03,
   "hfov": 29.62,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -25.26
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 11)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD659A1_D041_1CA5_41E4_629832082509",
   "yaw": -3.03,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -25.26,
   "hfov": 29.62,
   "distance": 100
  }
 ],
 "id": "overlay_C7B6F159_D043_0DE5_41E9_F1DD585196E1",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 88.94,
   "hfov": 31.37,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -16.68
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A, this.camera_E3E4CF82_D0C1_3564_41E5_7D4D6C6C75B5); this.mainPlayList.set('selectedIndex', 13)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD569A9_D041_1CA5_41D7_0195C1CB853A",
   "yaw": 88.94,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -16.68,
   "hfov": 31.37,
   "distance": 100
  }
 ],
 "id": "overlay_CC09A2FA_D047_0CA4_41E5_3F19F85A0EFE",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -5.09,
   "hfov": 30.1,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -23.2
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 15)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD529A9_D041_1CA5_41D3_BDD004FBF836",
   "yaw": -5.09,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -23.2,
   "hfov": 30.1,
   "distance": 100
  }
 ],
 "id": "overlay_CCCBE39F_D047_0C9C_41CE_2E79A987F48E",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_1_HS_2_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -179.43,
   "hfov": 28.73,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -28.69
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33, this.camera_E3D2FFAF_D0C1_34BC_41E8_46DAC59CAF20); this.mainPlayList.set('selectedIndex', 11)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD599A9_D041_1CA5_41DC_CF96326D5E47",
   "yaw": -179.43,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -28.69,
   "hfov": 28.73,
   "distance": 100
  }
 ],
 "id": "overlay_CCE656C2_D046_F4E7_41E6_3CD934DD09D1",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -2,
   "hfov": 28.34,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -30.06
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 4)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBDD1995_D041_1D6D_41E7_0B460880587F",
   "yaw": -2,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -30.06,
   "hfov": 28.34,
   "distance": 100
  }
 ],
 "id": "overlay_C02430F8_D043_0CA3_41CD_44D09E534043",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -170.83,
   "hfov": 28.54,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -29.38
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E, this.camera_E4C5C2BB_D0C1_0CA4_41DD_6D7A154A1BAF); this.mainPlayList.set('selectedIndex', 1)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBDDE996_D041_1D6F_41E1_CD839DF919C9",
   "yaw": -170.83,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -29.38,
   "hfov": 28.54,
   "distance": 100
  }
 ],
 "id": "overlay_C0D73D6F_D042_F5BC_41A6_FE3F8530393B",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -2.69,
   "hfov": 29.86,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -24.23
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 14)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD6C9A6_D041_1CAF_41BE_1CCF19BE5AD7",
   "yaw": -2.69,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -24.23,
   "hfov": 29.86,
   "distance": 100
  }
 ],
 "id": "overlay_C881942E_D041_0BBC_41D0_01E5E538B4AE",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -179.43,
   "hfov": 29.7,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -24.92
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08, this.camera_E43302E8_D0C1_0CA4_41D8_E8F0020243C9); this.mainPlayList.set('selectedIndex', 10)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD699A6_D041_1CAF_418B_3A395886CFDF",
   "yaw": -179.43,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -24.92,
   "hfov": 29.7,
   "distance": 100
  }
 ],
 "id": "overlay_C97F08C9_D041_3CE4_41BD_6A03F0731F1E",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -89.17,
   "hfov": 29.36,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -26.29
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A, this.camera_E24A7E5C_D0C1_379C_41B3_B2E0E2FF881C); this.mainPlayList.set('selectedIndex', 5)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBDDB996_D041_1D6F_41DA_37384A2DA21F",
   "yaw": -89.17,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -26.29,
   "hfov": 29.36,
   "distance": 100
  }
 ],
 "id": "overlay_C08B8CA6_D04F_34AF_41D6_2CEC293D734A",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 94.43,
   "hfov": 28.63,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -29.03
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC, this.camera_E26D9E08_D0C1_3764_41E6_296CB26D0A58); this.mainPlayList.set('selectedIndex', 6)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBDA7996_D041_1D6F_41CC_305DC6A81D06",
   "yaw": 94.43,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -29.03,
   "hfov": 28.63,
   "distance": 100
  }
 ],
 "id": "overlay_C13F0932_D04F_1DA4_41D1_6EDD11F486CB",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_1_HS_2_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -1.66,
   "hfov": 29.36,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -26.29
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 7)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBDAD996_D041_1D69_41D9_6847A13E12A9",
   "yaw": -1.66,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -26.29,
   "hfov": 29.36,
   "distance": 100
  }
 ],
 "id": "overlay_C1A7E8D2_D04F_1CE4_41E1_D0F255629E39",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_1_HS_3_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -179.45,
   "hfov": 28.82,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -28.35
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30, this.camera_E25B1E2F_D0C1_37BB_41E0_B4FCE86907E7); this.mainPlayList.set('selectedIndex', 3)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBDA999C_D041_1D63_41E9_CD93E9FAD979",
   "yaw": -179.45,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -28.35,
   "hfov": 28.82,
   "distance": 100
  }
 ],
 "id": "overlay_C5808B44_D05E_FDEC_41E8_CF4B21A845A1",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "media": "this.panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7",
 "class": "PanoramaPlayListItem",
 "begin": "this.setEndToItemIndex(this.mainPlayList, 21, 22)",
 "player": "this.MainViewerPanoramaPlayer",
 "id": "PanoramaPlayListItem_E21CAD83_D0C1_3564_41DD_987799902460",
 "camera": "this.panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_camera"
},
{
 "media": "this.panorama_DB74144C_D041_0BFC_41C8_08491C64A29F",
 "class": "PanoramaPlayListItem",
 "begin": "this.setEndToItemIndex(this.mainPlayList, 23, 24)",
 "player": "this.MainViewerPanoramaPlayer",
 "id": "PanoramaPlayListItem_E21C2D88_D0C1_3564_41E1_85CF605CD511",
 "camera": "this.panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_camera"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB79503F_D041_0B9B_41C4_7535E6897684_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 85.85,
   "hfov": 26.98,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -34.52
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E, this.camera_E32F7030_D0C1_0BA4_41DB_E51531533F80); this.mainPlayList.set('selectedIndex', 1)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBDD4995_D041_1D6D_41C8_4F6C05630F3C",
   "yaw": 85.85,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -34.52,
   "hfov": 26.98,
   "distance": 100
  }
 ],
 "id": "overlay_DF8157AD_D043_14BC_41DC_691F17AD4606",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -179.43,
   "hfov": 28.82,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -28.35
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D, this.camera_E30E9087_D0C1_0B6C_41DA_057E49243F04); this.mainPlayList.set('selectedIndex', 14)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD209AA_D041_1CA7_41E6_E2109F915572",
   "yaw": -179.43,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -28.35,
   "hfov": 28.82,
   "distance": 100
  }
 ],
 "id": "overlay_CDD0A475_D043_0BAC_41E0_C564C6F6DF7B",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -85.4,
   "hfov": 29.19,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -26.97
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA, this.camera_E31F605A_D0C1_0BE5_41D2_7B92403BD7EA); this.mainPlayList.set('selectedIndex', 16)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD2C9AA_D041_1CA7_41D2_0F4F644D0A40",
   "yaw": -85.4,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -26.97,
   "hfov": 29.19,
   "distance": 100
  }
 ],
 "id": "overlay_CD9AC247_D043_0FEC_41B7_5A1EA83689A7",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_0_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -94.68,
   "hfov": 27.42,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -33.15
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434, this.camera_E37E80AF_D0C1_0CBD_41E4_2991499B4465); this.mainPlayList.set('selectedIndex', 22)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_E0D0169B_D0C3_7764_41E8_F6ACBA1AC6CC",
   "yaw": -94.68,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -33.15,
   "hfov": 27.42,
   "distance": 100
  }
 ],
 "id": "overlay_F9EF8CF9_D0C6_F4A4_41AA_DB7E3B1436B6",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB79AA85_D043_1F6C_4181_305A69449F06_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -177.37,
   "hfov": 26.87,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -34.87
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A, this.camera_E487B20D_D0C1_0F7D_4192_9EB9D3615C64); this.mainPlayList.set('selectedIndex', 17)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD299B1_D041_1CA5_41D1_245A2C8EE99C",
   "yaw": -177.37,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -34.87,
   "hfov": 26.87,
   "distance": 100
  }
 ],
 "id": "overlay_F093273F_D043_759C_41DB_B1F7612CEDED",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB79AA85_D043_1F6C_4181_305A69449F06_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -2,
   "hfov": 28.73,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -28.69
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 19)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD309B2_D041_1CA7_41D8_FB815618DDBE",
   "yaw": -2,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -28.69,
   "hfov": 28.73,
   "distance": 100
  }
 ],
 "id": "overlay_F1484DF0_D043_14A3_41E6_BE39C509BC23",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -89.86,
   "hfov": 30.95,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -19.08
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D, this.camera_E3962F07_D0C1_356C_41CE_D08532D0C123); this.mainPlayList.set('selectedIndex', 14)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD419A8_D041_1CA3_41D7_E3DFFDBAD062",
   "yaw": -89.86,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -19.08,
   "hfov": 30.95,
   "distance": 100
  }
 ],
 "id": "overlay_CB7B6E7B_D041_17A4_41CC_E1D05E1FC818",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -179.45,
   "hfov": 30.62,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -20.8
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D, this.camera_E3A7BEDD_D0C1_349C_41E2_22915D3A7AE9); this.mainPlayList.set('selectedIndex', 12)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD4E9A8_D041_1CA3_41D8_8166AF971528",
   "yaw": -179.45,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -20.8,
   "hfov": 30.62,
   "distance": 100
  }
 ],
 "id": "overlay_CBFA60B7_D041_0CAC_41E3_67B19D77C491",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -96.04,
   "hfov": 29.86,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -24.23
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B, this.camera_E3308005_D0C1_0B6F_41DF_51140EEA9326); this.mainPlayList.set('selectedIndex', 7)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBDBF99E_D041_1C9F_41CF_569259A07143",
   "yaw": -96.04,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -24.23,
   "hfov": 29.86,
   "distance": 100
  }
 ],
 "id": "overlay_C429A935_D041_7DAC_41D5_130818EDB5A2",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -179.09,
   "hfov": 29.28,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -26.63
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC, this.camera_E3C2AFDD_D0C1_349C_41B2_FA8C0D4B1366); this.mainPlayList.set('selectedIndex', 6)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD8499F_D041_1C9D_41D2_287D0B74D09D",
   "yaw": -179.09,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -26.63,
   "hfov": 29.28,
   "distance": 100
  }
 ],
 "id": "overlay_C4D0A863_D041_3BA4_41DD_4FC52B77E294",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_1_HS_2_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -2,
   "hfov": 30.1,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -23.2
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 12)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD8299F_D041_1C9D_41E8_8320DF426B1C",
   "yaw": -2,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -23.2,
   "hfov": 30.1,
   "distance": 100
  }
 ],
 "id": "overlay_C48D6FC5_D041_14EC_41E5_B8EE8FC0824B",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -96.72,
   "hfov": 30.1,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -23.2
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA, this.camera_E472B37A_D0C1_0DA7_41BD_95F012250B38); this.mainPlayList.set('selectedIndex', 16)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD3F9B0_D041_1CA3_41E4_738BC2C52A65",
   "yaw": -96.72,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -23.2,
   "hfov": 30.1,
   "distance": 100
  }
 ],
 "id": "overlay_CFD50FFF_D041_149D_41DD_2ABA5CB162A6",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 0.4,
   "hfov": 29.1,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -27.32
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 18)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD2C9B1_D041_1CA5_41E3_9108BD2499AE",
   "yaw": 0.4,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -27.32,
   "hfov": 29.1,
   "distance": 100
  }
 ],
 "id": "overlay_CF98E58F_D041_357C_41E8_60A57A0D9831",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -179.43,
   "hfov": 28.34,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -30.06
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB79AA85_D043_1F6C_4181_305A69449F06, this.camera_E3A84EB5_D0C1_34AC_41E1_C6B40E155169); this.mainPlayList.set('selectedIndex', 18)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD3F9B2_D041_1CA7_41E8_5995C3DF24A3",
   "yaw": -179.43,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -30.06,
   "hfov": 28.34,
   "distance": 100
  }
 ],
 "id": "overlay_F1FD2D08_D041_1564_41DD_60A549B59E44",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 30.94,
   "hfov": 29.7,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -24.92
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3, this.camera_E3B85E88_D0C1_3764_41D1_3863BE85CB09); this.mainPlayList.set('selectedIndex', 20)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD049B2_D041_1CA7_41E4_A77184CE3DBD",
   "yaw": 30.94,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -24.92,
   "hfov": 29.7,
   "distance": 100
  }
 ],
 "id": "overlay_F1B2AC47_D041_3BEC_41E5_B506D3FA52F3",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_0_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 78.29,
   "hfov": 28.82,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -28.35
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7, this.camera_E4602391_D0C1_0D65_41E3_9C589F8A6691); this.mainPlayList.set('selectedIndex', 21)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_E0D3B69B_D0C3_7764_41CD_1491F584BA04",
   "yaw": 78.29,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -28.35,
   "hfov": 28.82,
   "distance": 100
  }
 ],
 "id": "overlay_FCB5939A_D0C1_0D64_41DD_FF6B3DB88064",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -85.05,
   "hfov": 30.4,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -21.83
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A, this.camera_E402F364_D0C1_0DAC_41E9_2196A724EE5B); this.mainPlayList.set('selectedIndex', 17)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD2B9AA_D041_1CA7_41D7_617B72F0FB7E",
   "yaw": -85.05,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -21.83,
   "hfov": 30.4,
   "distance": 100
  }
 ],
 "id": "overlay_CE7BED34_D07E_F5AC_41C3_5A5B341B3655",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 94.09,
   "hfov": 29.7,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -24.92
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E, this.camera_E412E340_D0C1_0DE4_41C4_8021407928BC); this.mainPlayList.set('selectedIndex', 15)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD379AB_D041_1CB8_41E0_879F4F60DF8F",
   "yaw": 94.09,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -24.92,
   "hfov": 29.7,
   "distance": 100
  }
 ],
 "id": "overlay_CECE42DD_D07F_0C9C_41E0_B2007FBB88B9",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -178.38,
   "hfov": 29.28,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -26.63
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B, this.camera_E48861E4_D0C1_0CAC_41D2_ED5376021848); this.mainPlayList.set('selectedIndex', 7)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD8E99F_D041_1C9D_41E5_4D4250321DDD",
   "yaw": -178.38,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -26.63,
   "hfov": 29.28,
   "distance": 100
  }
 ],
 "id": "overlay_C65CA86B_D05F_1BA5_41C2_08671513530F",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -2.69,
   "hfov": 29.7,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -24.92
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 10)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD959A0_D041_1CA3_41E1_A05CB0EA12EF",
   "yaw": -2.69,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -24.92,
   "hfov": 29.7,
   "distance": 100
  }
 ],
 "id": "overlay_C62E15A9_D05F_14A4_41E3_0BB323C14C6E",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -120.08,
   "hfov": 30.95,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -19.08
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB, this.camera_E4BA215D_D0C1_0D9C_41AC_F00CC4EE7BAB); this.mainPlayList.set('selectedIndex', 19)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD0D9B3_D041_1CA5_41D7_DE65C70F5805",
   "yaw": -120.08,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -19.08,
   "hfov": 30.95,
   "distance": 100
  }
 ],
 "id": "overlay_F289EDA6_D047_14AC_41DE_74A6DB5DDBE5",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 85.85,
   "hfov": 30.02,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -23.54
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74, this.camera_E36CC0DD_D0C1_0C9D_41DE_6020364361EC); this.mainPlayList.set('selectedIndex', 8)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD8799D_D041_1C9D_41B4_C215982C2E1C",
   "yaw": 85.85,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -23.54,
   "hfov": 30.02,
   "distance": 100
  }
 ],
 "id": "overlay_C315C1CB_D047_0CE4_41D9_A00CE5ACED65",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -3.38,
   "hfov": 29.45,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -25.94
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 9)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD8E99E_D041_1C9F_41E5_D3E83D8ACDF7",
   "yaw": -3.38,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -25.94,
   "hfov": 29.45,
   "distance": 100
  }
 ],
 "id": "overlay_C3D17B88_D047_7D64_41E0_B4B6AD07AB1C",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_1_HS_2_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -179.43,
   "hfov": 29.36,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -26.29
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB7A023B_D041_0FA5_4191_326E556417C6, this.camera_E35CB108_D0C1_0D64_41C9_7F3462FD2806); this.mainPlayList.set('selectedIndex', 4)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD8999E_D041_1C9F_41C6_0F613F8FA93F",
   "yaw": -179.43,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -26.29,
   "hfov": 29.36,
   "distance": 100
  }
 ],
 "id": "overlay_C5092A22_D041_1FA4_41DF_DB7DFBC920D3",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_0_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -96.4,
   "hfov": 29.53,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -25.6
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB74144C_D041_0BFC_41C8_08491C64A29F, this.camera_E4234315_D0C1_0D6C_41C0_67057F418EA2); this.mainPlayList.set('selectedIndex', 23)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_E0D2A69C_D0C3_749C_41C5_4DA1FC053A55",
   "yaw": -96.4,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -25.6,
   "hfov": 29.53,
   "distance": 100
  }
 ],
 "id": "overlay_FA85799C_D0C1_1D63_41B8_701C9B1EEF9B",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 14.13,
   "hfov": 27.31,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -33.49
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 3)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBDC6994_D041_1D63_41E3_77B39D286118",
   "yaw": 14.13,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -33.49,
   "hfov": 27.31,
   "distance": 100
  }
 ],
 "id": "overlay_DEC20D50_D047_15E4_41DE_99B83D1F39DA",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -92.6,
   "hfov": 27.84,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -31.78
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB79503F_D041_0B9B_41C4_7535E6897684, this.camera_E4D52293_D0C1_0F64_41C6_896C1BE4C7B7); this.mainPlayList.set('selectedIndex', 2)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBDC3994_D041_1D63_41D3_8120A5C498B1",
   "yaw": -92.6,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -31.78,
   "hfov": 27.84,
   "distance": 100
  }
 ],
 "id": "overlay_DE9FD8AE_D047_3CBC_41C6_77FCC1A6A19F",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_1_HS_2_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -172.22,
   "hfov": 28.73,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -28.69
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74, this.camera_E4E7C267_D0C1_0FAD_41E4_D3A9FD311D99); this.mainPlayList.set('selectedIndex', 0)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBDCE995_D041_1D6D_41E0_89CADD89742D",
   "yaw": -172.22,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -28.69,
   "hfov": 28.73,
   "distance": 100
  }
 ],
 "id": "overlay_DF082406_D041_0B6F_41D6_FDCBFD8FA2D4",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -84.37,
   "hfov": 30.02,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -23.54
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB7A023B_D041_0FA5_4191_326E556417C6, this.camera_E27DEDDB_D0C1_34E5_41E9_7D761E79CA8C); this.mainPlayList.set('selectedIndex', 4)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBDBC99D_D041_1C9D_41E0_8CCBCCFE0A26",
   "yaw": -84.37,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -23.54,
   "hfov": 30.02,
   "distance": 100
  }
 ],
 "id": "overlay_C2E35488_D041_0B64_41C9_A5A68377EB70",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -3.38,
   "hfov": 29.78,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -24.57
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 8)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBDBA99D_D041_1C9D_41E9_14E48B2334ED",
   "yaw": -3.38,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -24.57,
   "hfov": 29.78,
   "distance": 100
  }
 ],
 "id": "overlay_C2A3EDCA_D041_34E4_41CD_D6037E9F7D19",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -2,
   "hfov": 28.34,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -30.06
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 1)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBDFD992_D041_1D67_41CA_4788F7605914",
   "yaw": -2,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -30.06,
   "hfov": 28.34,
   "distance": 100
  }
 ],
 "id": "overlay_DDA5C7DD_D047_349D_41C1_925595C3262B",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_1_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -2,
   "hfov": 28.34,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -30.06
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 13)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD709A7_D041_1CAD_41D0_43E759227C81",
   "yaw": -2,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -30.06,
   "hfov": 28.34,
   "distance": 100
  }
 ],
 "id": "overlay_C9ABFE65_D041_17AD_41CB_5D93CF38F6C9",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_1_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -88.14,
   "hfov": 29.7,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -24.92
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08, this.camera_E49811B7_D0C1_0CAC_41E6_8E8CE6934B07); this.mainPlayList.set('selectedIndex', 10)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD7F9A7_D041_1CAD_41B2_D60537B73085",
   "yaw": -88.14,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -24.92,
   "hfov": 29.7,
   "distance": 100
  }
 ],
 "id": "overlay_CA43F617_D041_176C_41C8_9AB008D79223",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_1_HS_2_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -179.43,
   "hfov": 29.45,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -25.94
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74, this.camera_E4AAD18A_D0C1_0D64_41E3_6C30A30CFB39); this.mainPlayList.set('selectedIndex', 8)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_FBD7B9A8_D041_1CA3_41E1_D2933242AA80",
   "yaw": -179.43,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -25.94,
   "hfov": 29.45,
   "distance": 100
  }
 ],
 "id": "overlay_CA3B2DC2_D041_14E4_41D3_AEE403CA26DC",
 "data": {
  "label": "Arrow 05b"
 }
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "children": [
  "this.Container_7FF195EF_706F_7FC6_41D7_A104CA87824D",
  "this.IconButton_7FF185EF_706F_7FC6_41A5_21B418265412"
 ],
 "id": "Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D",
 "left": "0%",
 "scrollBarMargin": 2,
 "width": 66,
 "class": "Container",
 "layout": "absolute",
 "contentOpaque": false,
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "creationPolicy": "inAdvance",
 "borderRadius": 0,
 "top": "0%",
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "height": "100%",
 "paddingBottom": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "- COLLAPSE"
 },
 "scrollBarOpacity": 0.5,
 "visible": false,
 "overflow": "scroll",
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "Container_7DB20382_7065_343F_4186_6E0B0B3AFF36",
 "scrollBarMargin": 2,
 "width": 300,
 "class": "Container",
 "children": [
  "this.Container_7DB3F373_7065_34CE_41B4_E77DDA40A4F3",
  "this.Container_7DBCC382_7065_343F_41D5_9D3C36B5F479",
  "this.Image_F6FC231A_D03F_0D67_41E3_3E477AED05A6"
 ],
 "layout": "absolute",
 "contentOpaque": false,
 "right": "0%",
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 40,
 "top": "0%",
 "backgroundOpacity": 0.7,
 "minWidth": 1,
 "backgroundColor": [
  "#000000"
 ],
 "borderSize": 0,
 "borderRadius": 0,
 "gap": 10,
 "paddingTop": 40,
 "propagateClick": true,
 "height": "100%",
 "paddingBottom": 40,
 "backgroundColorRatios": [
  0
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "- EXPANDED"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "paddingLeft": 40,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": true,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "Container_062A782F_1140_E20B_41AF_B3E5DE341773",
 "left": "15%",
 "scrollBarMargin": 2,
 "children": [
  "this.Container_062A682F_1140_E20B_41B0_3071FCBF3DC9",
  "this.Container_062A082F_1140_E20A_4193_DF1A4391DC79"
 ],
 "shadowColor": "#000000",
 "class": "Container",
 "right": "15%",
 "layout": "horizontal",
 "shadowBlurRadius": 25,
 "shadowSpread": 1,
 "contentOpaque": false,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "minHeight": 1,
 "top": "10%",
 "backgroundOpacity": 1,
 "minWidth": 1,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "shadowOpacity": 0.3,
 "borderSize": 0,
 "borderRadius": 0,
 "gap": 10,
 "shadowVerticalLength": 0,
 "paddingTop": 0,
 "bottom": "10%",
 "propagateClick": false,
 "paddingBottom": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "shadowHorizontalLength": 0,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "data": {
  "name": "Global"
 },
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "right",
 "children": [
  "this.IconButton_062A8830_1140_E215_419D_3439F16CCB3E"
 ],
 "id": "Container_062A9830_1140_E215_41A7_5F2BBE5C20E4",
 "left": "15%",
 "scrollBarMargin": 2,
 "class": "Container",
 "right": "15%",
 "layout": "vertical",
 "contentOpaque": false,
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 20,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "top": "10%",
 "bottom": "80%",
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 20,
 "propagateClick": false,
 "paddingBottom": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "Container X global"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "visible",
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver"
},
{
 "shadow": true,
 "horizontalAlign": "center",
 "scrollBarVisible": "rollOver",
 "id": "Container_39A197B1_0C06_62AF_419A_D15E4DDD2528",
 "left": "15%",
 "scrollBarMargin": 2,
 "children": [
  "this.Container_3A67552A_0C3A_67BD_4195_ECE46CCB34EA",
  "this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0"
 ],
 "shadowColor": "#000000",
 "class": "Container",
 "right": "15%",
 "layout": "absolute",
 "shadowBlurRadius": 25,
 "shadowSpread": 1,
 "contentOpaque": false,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "minHeight": 1,
 "top": "10%",
 "backgroundOpacity": 1,
 "minWidth": 1,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "shadowOpacity": 0.3,
 "borderSize": 0,
 "borderRadius": 0,
 "gap": 10,
 "shadowVerticalLength": 0,
 "paddingTop": 0,
 "bottom": "10%",
 "propagateClick": false,
 "paddingBottom": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "shadowHorizontalLength": 0,
 "scrollBarOpacity": 0.5,
 "overflow": "visible",
 "data": {
  "name": "Global"
 },
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": true,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "Container_221C1648_0C06_E5FD_4180_8A2E8B66315E",
 "left": "15%",
 "scrollBarMargin": 2,
 "children": [
  "this.WebFrame_22F9EEFF_0C1A_2293_4165_411D4444EFEA"
 ],
 "shadowColor": "#000000",
 "class": "Container",
 "right": "15%",
 "layout": "horizontal",
 "shadowBlurRadius": 25,
 "shadowSpread": 1,
 "contentOpaque": false,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "minHeight": 1,
 "top": "10%",
 "backgroundOpacity": 1,
 "minWidth": 1,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "shadowOpacity": 0.3,
 "borderSize": 0,
 "borderRadius": 0,
 "gap": 10,
 "shadowVerticalLength": 0,
 "paddingTop": 0,
 "bottom": "10%",
 "propagateClick": false,
 "paddingBottom": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "shadowHorizontalLength": 0,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "data": {
  "name": "Global"
 },
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "right",
 "children": [
  "this.IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF"
 ],
 "id": "Container_221B3648_0C06_E5FD_4199_FCE031AE003B",
 "left": "15%",
 "scrollBarMargin": 2,
 "class": "Container",
 "right": "15%",
 "layout": "vertical",
 "contentOpaque": false,
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 20,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "top": "10%",
 "bottom": "80%",
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 20,
 "propagateClick": false,
 "paddingBottom": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "Container X global"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "visible",
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver"
},
{
 "shadow": true,
 "horizontalAlign": "center",
 "scrollBarVisible": "rollOver",
 "id": "Container_2F8A6686_0D4F_6B71_4174_A02FE43588D3",
 "left": "15%",
 "scrollBarMargin": 2,
 "children": [
  "this.MapViewer",
  "this.Container_2F8A7686_0D4F_6B71_41A9_1A894413085C"
 ],
 "shadowColor": "#000000",
 "class": "Container",
 "right": "15%",
 "layout": "absolute",
 "shadowBlurRadius": 25,
 "shadowSpread": 1,
 "contentOpaque": false,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "minHeight": 1,
 "top": "10%",
 "backgroundOpacity": 1,
 "minWidth": 1,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "shadowOpacity": 0.3,
 "borderSize": 0,
 "borderRadius": 0,
 "gap": 10,
 "shadowVerticalLength": 0,
 "paddingTop": 0,
 "bottom": "10%",
 "propagateClick": false,
 "paddingBottom": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "shadowHorizontalLength": 0,
 "scrollBarOpacity": 0.5,
 "overflow": "visible",
 "data": {
  "name": "Global"
 },
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": true,
 "horizontalAlign": "center",
 "scrollBarVisible": "rollOver",
 "id": "Container_2A193C4C_0D3B_DFF0_4161_A2CD128EF536",
 "left": "15%",
 "scrollBarMargin": 2,
 "children": [
  "this.Container_2A19EC4C_0D3B_DFF0_414D_37145C22C5BC"
 ],
 "shadowColor": "#000000",
 "class": "Container",
 "right": "15%",
 "layout": "vertical",
 "shadowBlurRadius": 25,
 "shadowSpread": 1,
 "contentOpaque": false,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "minHeight": 1,
 "top": "10%",
 "backgroundOpacity": 1,
 "minWidth": 1,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "shadowOpacity": 0.3,
 "borderSize": 0,
 "borderRadius": 0,
 "gap": 10,
 "shadowVerticalLength": 0,
 "paddingTop": 0,
 "bottom": "10%",
 "propagateClick": false,
 "paddingBottom": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "shadowHorizontalLength": 0,
 "scrollBarOpacity": 0.5,
 "overflow": "visible",
 "data": {
  "name": "Global"
 },
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": true,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "Container_06C5DBA5_1140_A63F_41AD_1D83A33F1255",
 "left": "15%",
 "scrollBarMargin": 2,
 "children": [
  "this.Container_06C5ABA5_1140_A63F_41A9_850CF958D0DB",
  "this.Container_06C58BA5_1140_A63F_419D_EC83F94F8C54"
 ],
 "shadowColor": "#000000",
 "class": "Container",
 "right": "15%",
 "layout": "horizontal",
 "shadowBlurRadius": 25,
 "shadowSpread": 1,
 "contentOpaque": false,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "minHeight": 1,
 "top": "10%",
 "backgroundOpacity": 1,
 "minWidth": 1,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "shadowOpacity": 0.3,
 "borderSize": 0,
 "borderRadius": 0,
 "gap": 10,
 "shadowVerticalLength": 0,
 "paddingTop": 0,
 "bottom": "10%",
 "propagateClick": false,
 "paddingBottom": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "shadowHorizontalLength": 0,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "data": {
  "name": "Global"
 },
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "right",
 "children": [
  "this.IconButton_06C40BA5_1140_A63F_41AC_FA560325FD81"
 ],
 "id": "Container_06C43BA5_1140_A63F_41A1_96DC8F4CAD2F",
 "left": "15%",
 "scrollBarMargin": 2,
 "class": "Container",
 "right": "15%",
 "layout": "vertical",
 "contentOpaque": false,
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 20,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "top": "10%",
 "bottom": "80%",
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 20,
 "propagateClick": false,
 "paddingBottom": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "Container X global"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "visible",
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver"
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB74144C_D041_0BFC_41C8_08491C64A29F_0_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_E0D3C69C_D0C3_749C_41E6_67AD78FD7A67",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB7ACD7F_D041_159C_41E8_EFE538D92C5A_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBDB099C_D041_1D63_41E5_1816E8DF0578",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD939A0_D041_1CA3_41E6_13303869868B",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD999A0_D041_1CA3_41E6_AF685CEDFE18",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB78E050_D043_0BE4_41E8_9A080F1A9B08_1_HS_2_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD659A1_D041_1CA5_41E4_629832082509",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD569A9_D041_1CA5_41D7_0195C1CB853A",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD529A9_D041_1CA5_41D3_BDD004FBF836",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB7604AF_D043_34BC_41DC_88FFDFC7354D_1_HS_2_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD599A9_D041_1CA5_41DC_CF96326D5E47",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBDD1995_D041_1D6D_41E7_0B460880587F",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB7BF5D8_D041_F4E3_41E1_891BEE9EED30_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBDDE996_D041_1D6F_41E1_CD839DF919C9",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD6C9A6_D041_1CAF_41BE_1CCF19BE5AD7",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB78739A_D043_0D67_41E7_83FDD8B48B33_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD699A6_D041_1CAF_418B_3A395886CFDF",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBDDB996_D041_1D6F_41DA_37384A2DA21F",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBDA7996_D041_1D6F_41CC_305DC6A81D06",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_1_HS_2_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBDAD996_D041_1D69_41D9_6847A13E12A9",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB7A023B_D041_0FA5_4191_326E556417C6_1_HS_3_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBDA999C_D041_1D63_41E9_CD93E9FAD979",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB79503F_D041_0B9B_41C4_7535E6897684_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBDD4995_D041_1D6D_41C8_4F6C05630F3C",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD209AA_D041_1CA7_41E6_E2109F915572",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB7DEA65_D043_1FAC_41E6_C92003901A9E_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD2C9AA_D041_1CA7_41D2_0F4F644D0A40",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB7FAA7C_D041_1F9C_41E3_9B25F61EEBA7_0_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_E0D0169B_D0C3_7764_41E8_F6ACBA1AC6CC",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB79AA85_D043_1F6C_4181_305A69449F06_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD299B1_D041_1CA5_41D1_245A2C8EE99C",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB79AA85_D043_1F6C_4181_305A69449F06_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD309B2_D041_1CA7_41D8_FB815618DDBE",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD419A8_D041_1CA3_41D7_E3DFFDBAD062",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB769FAE_D043_F4BC_41D2_035AA095E13A_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD4E9A8_D041_1CA3_41D8_8166AF971528",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBDBF99E_D041_1C9F_41CF_569259A07143",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD8499F_D041_1C9D_41D2_287D0B74D09D",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB7AFD2D_D042_F5BD_41D0_C793D4F92B74_1_HS_2_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD8299F_D041_1C9D_41E8_8320DF426B1C",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD3F9B0_D041_1CA3_41E4_738BC2C52A65",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB7A6562_D043_35A4_41E1_E2DCC8852D5A_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD2C9B1_D041_1CA5_41E3_9108BD2499AE",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD3F9B2_D041_1CA7_41E8_5995C3DF24A3",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB781FC0_D042_F4E4_41DD_00F8E0E5E0AB_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD049B2_D041_1CA7_41E4_A77184CE3DBD",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB77AF73_D041_75A5_41D0_F7A33DA39434_0_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_E0D3B69B_D0C3_7764_41CD_1491F584BA04",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD2B9AA_D041_1CA7_41D7_617B72F0FB7E",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB7D200F_D043_0B7D_41CA_5524FBA85EEA_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD379AB_D041_1CB8_41E0_879F4F60DF8F",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD8E99F_D041_1C9D_41E5_4D4250321DDD",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB787525_D043_35AC_41E3_7A6B11BF6222_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD959A0_D041_1CA3_41E1_A05CB0EA12EF",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB7B7511_D041_3565_41DF_8B09B2F6A7E3_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD0D9B3_D041_1CA5_41D7_DE65C70F5805",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD8799D_D041_1C9D_41B4_C215982C2E1C",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD8E99E_D041_1C9F_41E5_D3E83D8ACDF7",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB7A840D_D041_0B7C_41DD_0D1BCFB5696B_1_HS_2_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD8999E_D041_1C9F_41C6_0F613F8FA93F",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB7609FC_D041_1C9C_41C5_24A43569271A_0_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_E0D2A69C_D0C3_749C_41C5_4DA1FC053A55",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBDC6994_D041_1D63_41E3_77B39D286118",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBDC3994_D041_1D63_41D3_8120A5C498B1",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB68EA71_D041_1FA4_41DA_75A4290B098E_1_HS_2_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBDCE995_D041_1D6D_41E0_89CADD89742D",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBDBC99D_D041_1C9D_41E0_8CCBCCFE0A26",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB7AD9CA_D041_1CE7_41CA_1A42E065D4CC_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBDBA99D_D041_1C9D_41E9_14E48B2334ED",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DBA6484A_D041_1BE4_41E4_2200849F7F74_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBDFD992_D041_1D67_41CA_4788F7605914",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_1_HS_0_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD709A7_D041_1CAD_41D0_43E759227C81",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_1_HS_1_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD7F9A7_D041_1CAD_41B2_D60537B73085",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_DB7B3A0B_D043_1F64_41E9_82C72B10078D_1_HS_2_0.png",
   "width": 480,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_FBD7B9A8_D041_1CA3_41E1_D2933242AA80",
 "rowCount": 6
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "Container_7FF195EF_706F_7FC6_41D7_A104CA87824D",
 "left": "0%",
 "scrollBarMargin": 2,
 "width": 36,
 "class": "Container",
 "layout": "absolute",
 "contentOpaque": false,
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "top": "0%",
 "backgroundOpacity": 0.4,
 "minWidth": 1,
 "backgroundColor": [
  "#000000"
 ],
 "borderSize": 0,
 "borderRadius": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "height": "100%",
 "paddingBottom": 0,
 "backgroundColorRatios": [
  0
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "Container black"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "center",
 "maxHeight": 80,
 "maxWidth": 80,
 "id": "IconButton_7FF185EF_706F_7FC6_41A5_21B418265412",
 "left": 10,
 "width": 50,
 "class": "IconButton",
 "minHeight": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "top": "40%",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "bottom": "40%",
 "borderSize": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_7FF185EF_706F_7FC6_41A5_21B418265412_rollover.png",
 "propagateClick": true,
 "iconURL": "skin/IconButton_7FF185EF_706F_7FC6_41A5_21B418265412.png",
 "paddingBottom": 0,
 "click": "this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, false, 0, null, null, false); this.setComponentVisibility(this.Container_7DB20382_7065_343F_4186_6E0B0B3AFF36, true, 0, null, null, false)",
 "transparencyActive": true,
 "data": {
  "name": "IconButton arrow"
 },
 "paddingLeft": 0,
 "cursor": "hand"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "children": [
  "this.Container_7DB3E382_7065_343F_41C2_E1E6BB5BA055",
  "this.Button_7DB31382_7065_343F_41D6_641BBE1B2562",
  "this.Container_7DB30382_7065_343F_416C_8610BCBA9F50",
  "this.Button_7DB33382_7065_343F_41B1_0B0F019C1828",
  "this.Container_7DB32382_7065_343F_419E_6594814C420F",
  "this.Button_7DB35382_7065_343F_41C5_CF0EAF3E4CFF",
  "this.Container_7DB34382_7065_343F_41CB_A5B96E9749EE",
  "this.Button_7DB37382_7065_343F_41CC_EC41ABCCDE1B",
  "this.Container_7DBC9382_7065_343F_41CC_ED357655BB95",
  "this.Button_7DBC8382_7065_343F_4183_17B44518DB40",
  "this.Container_7DBCB382_7065_343F_41D8_AB382D384291",
  "this.Button_7DBCA382_7065_343F_41DB_48D975E3D9EC",
  "this.Container_7DBCD382_7065_343F_41D8_FC14DFF91DA9",
  "this.Button_F8EC2AE9_D0C3_1CA7_41E4_42A68847E9A2",
  "this.Container_F9844F88_D0C3_1564_41DB_87FD89C84208",
  "this.Button_F80D86CA_D0C3_34E4_41B5_9065761A793E",
  "this.Container_F9AED231_D0C3_0FA4_41E0_C09B22360F8E"
 ],
 "id": "Container_7DB3F373_7065_34CE_41B4_E77DDA40A4F3",
 "scrollBarMargin": 2,
 "width": "100%",
 "class": "Container",
 "right": "0%",
 "layout": "vertical",
 "contentOpaque": false,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "top": "25%",
 "bottom": "25%",
 "borderSize": 0,
 "gap": 0,
 "paddingTop": 0,
 "propagateClick": true,
 "paddingBottom": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "-Container buttons"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "children": [
  "this.Container_7DB2F382_7065_343F_41C8_85C6AE9C717F",
  "this.HTMLText_7DB2E382_7065_343F_41C2_951F708170F1",
  "this.IconButton_7DB21382_7065_343F_41B1_484EDBCD16A4"
 ],
 "id": "Container_7DBCC382_7065_343F_41D5_9D3C36B5F479",
 "scrollBarMargin": 2,
 "width": "100%",
 "class": "Container",
 "right": "0%",
 "layout": "vertical",
 "contentOpaque": false,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "bottom",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "bottom": "0%",
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "height": "26.316%",
 "paddingBottom": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "-Container footer"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver"
},
{
 "shadow": false,
 "horizontalAlign": "center",
 "maxHeight": 976,
 "maxWidth": 1229,
 "id": "Image_F6FC231A_D03F_0D67_41E3_3E477AED05A6",
 "left": "2.86%",
 "width": "82.636%",
 "class": "Image",
 "url": "skin/Image_F6FC231A_D03F_0D67_41E3_3E477AED05A6.png",
 "minHeight": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "top": "0%",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "24.233%",
 "paddingBottom": 0,
 "scaleMode": "fit_inside",
 "data": {
  "name": "Image37475"
 },
 "paddingLeft": 0
},
{
 "shadow": false,
 "horizontalAlign": "center",
 "scrollBarVisible": "rollOver",
 "id": "Container_062A682F_1140_E20B_41B0_3071FCBF3DC9",
 "scrollBarMargin": 2,
 "children": [
  "this.Image_062A182F_1140_E20B_41B0_9CB8FFD6AA5A"
 ],
 "class": "Container",
 "width": "85%",
 "layout": "absolute",
 "contentOpaque": false,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundColor": [
  "#000000"
 ],
 "backgroundOpacity": 1,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 0,
 "backgroundColorRatios": [
  0
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "-left"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "Container_062A082F_1140_E20A_4193_DF1A4391DC79",
 "scrollBarMargin": 2,
 "children": [
  "this.Container_062A3830_1140_E215_4195_1698933FE51C",
  "this.Container_062A2830_1140_E215_41AA_EB25B7BD381C",
  "this.Container_062AE830_1140_E215_4180_196ED689F4BD"
 ],
 "class": "Container",
 "width": "50%",
 "layout": "vertical",
 "contentOpaque": false,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 50,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundOpacity": 1,
 "minWidth": 460,
 "borderRadius": 0,
 "borderSize": 0,
 "gap": 0,
 "paddingTop": 20,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 20,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#0069A3",
 "data": {
  "name": "-right"
 },
 "scrollBarOpacity": 0.51,
 "overflow": "visible",
 "paddingLeft": 50,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "center",
 "maxHeight": 60,
 "maxWidth": 60,
 "id": "IconButton_062A8830_1140_E215_419D_3439F16CCB3E",
 "width": "25%",
 "class": "IconButton",
 "minHeight": 50,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 50,
 "mode": "push",
 "borderRadius": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_062A8830_1140_E215_419D_3439F16CCB3E_rollover.jpg",
 "propagateClick": false,
 "iconURL": "skin/IconButton_062A8830_1140_E215_419D_3439F16CCB3E.jpg",
 "paddingBottom": 0,
 "click": "this.setComponentVisibility(this.Container_062AB830_1140_E215_41AF_6C9D65345420, false, 0, null, null, false); this.setComponentVisibility(this.Container_7DB20382_7065_343F_4186_6E0B0B3AFF36, false, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "transparencyActive": false,
 "height": "75%",
 "data": {
  "name": "X"
 },
 "paddingLeft": 0,
 "cursor": "hand",
 "pressedIconURL": "skin/IconButton_062A8830_1140_E215_419D_3439F16CCB3E_pressed.jpg"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "Container_3A67552A_0C3A_67BD_4195_ECE46CCB34EA",
 "scrollBarMargin": 2,
 "children": [
  "this.IconButton_38922473_0C06_2593_4199_C585853A1AB3"
 ],
 "class": "Container",
 "width": "100%",
 "layout": "absolute",
 "contentOpaque": false,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "height": 140,
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "header"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "itemMaxHeight": 1000,
 "horizontalAlign": "center",
 "rollOverItemThumbnailShadowVerticalLength": 0,
 "id": "ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0",
 "left": 0,
 "itemLabelFontFamily": "Oswald",
 "rollOverItemThumbnailShadowColor": "#04A3E1",
 "class": "ThumbnailGrid",
 "width": "100%",
 "itemBorderRadius": 0,
 "itemHorizontalAlign": "center",
 "selectedItemThumbnailShadowBlurRadius": 16,
 "minHeight": 1,
 "itemLabelPosition": "bottom",
 "verticalAlign": "middle",
 "paddingRight": 70,
 "backgroundOpacity": 0,
 "itemPaddingLeft": 3,
 "height": "92%",
 "playList": "this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist",
 "itemThumbnailBorderRadius": 0,
 "minWidth": 1,
 "borderSize": 0,
 "itemBackgroundOpacity": 0,
 "itemWidth": 220,
 "rollOverItemThumbnailShadowBlurRadius": 0,
 "itemBackgroundColor": [],
 "propagateClick": false,
 "itemMinHeight": 50,
 "itemBackgroundColorRatios": [],
 "itemPaddingTop": 3,
 "itemThumbnailOpacity": 1,
 "itemVerticalAlign": "top",
 "paddingLeft": 70,
 "selectedItemThumbnailShadow": true,
 "rollOverItemLabelFontColor": "#04A3E1",
 "scrollBarMargin": 2,
 "itemThumbnailHeight": 125,
 "itemLabelTextDecoration": "none",
 "itemMinWidth": 50,
 "itemLabelFontWeight": "normal",
 "rollOverItemThumbnailShadow": true,
 "itemPaddingRight": 3,
 "itemThumbnailScaleMode": "fit_outside",
 "itemLabelFontSize": 16,
 "itemHeight": 160,
 "selectedItemLabelFontColor": "#04A3E1",
 "scrollBarWidth": 10,
 "itemThumbnailWidth": 220,
 "itemOpacity": 1,
 "bottom": -0.2,
 "borderRadius": 5,
 "itemLabelFontColor": "#666666",
 "rollOverItemThumbnailShadowHorizontalLength": 8,
 "itemBackgroundColorDirection": "vertical",
 "gap": 26,
 "paddingTop": 10,
 "itemThumbnailShadow": false,
 "paddingBottom": 70,
 "selectedItemLabelFontWeight": "bold",
 "scrollBarColor": "#04A3E1",
 "itemPaddingBottom": 3,
 "itemLabelGap": 7,
 "selectedItemThumbnailShadowHorizontalLength": 0,
 "itemLabelFontStyle": "italic",
 "scrollBarOpacity": 0.5,
 "shadow": false,
 "selectedItemThumbnailShadowVerticalLength": 0,
 "data": {
  "name": "ThumbnailList"
 },
 "scrollBarVisible": "rollOver",
 "itemMode": "normal",
 "itemLabelHorizontalAlign": "center",
 "itemMaxWidth": 1000
},
{
 "shadow": false,
 "id": "WebFrame_22F9EEFF_0C1A_2293_4165_411D4444EFEA",
 "insetBorder": false,
 "width": "100%",
 "scrollEnabled": true,
 "class": "WebFrame",
 "url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14377.55330038866!2d-73.99492968084243!3d40.75084469078082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9f775f259%3A0x999668d0d7c3fd7d!2s400+5th+Ave%2C+New+York%2C+NY+10018!5e0!3m2!1ses!2sus!4v1467271743182",
 "minHeight": 1,
 "paddingRight": 0,
 "backgroundColor": [
  "#FFFFFF"
 ],
 "backgroundOpacity": 1,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 0,
 "backgroundColorRatios": [
  0
 ],
 "data": {
  "name": "WebFrame48191"
 },
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "center",
 "maxHeight": 60,
 "maxWidth": 60,
 "id": "IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF",
 "width": "25%",
 "class": "IconButton",
 "minHeight": 50,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 50,
 "mode": "push",
 "borderRadius": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF_rollover.jpg",
 "propagateClick": false,
 "iconURL": "skin/IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF.jpg",
 "paddingBottom": 0,
 "click": "this.setComponentVisibility(this.Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7, false, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "transparencyActive": false,
 "height": "75%",
 "data": {
  "name": "X"
 },
 "paddingLeft": 0,
 "cursor": "hand",
 "pressedIconURL": "skin/IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF_pressed.jpg"
},
{
 "playbackBarHeight": 10,
 "toolTipFontSize": 12,
 "id": "MapViewer",
 "left": 0,
 "playbackBarBackgroundColorDirection": "vertical",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "toolTipTextShadowColor": "#000000",
 "class": "ViewerArea",
 "width": "100%",
 "toolTipFontWeight": "normal",
 "toolTipTextShadowBlurRadius": 3,
 "toolTipPaddingBottom": 4,
 "progressBarBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "playbackBarRight": 0,
 "playbackBarProgressBorderSize": 0,
 "minHeight": 1,
 "playbackBarHeadShadowVerticalLength": 0,
 "playbackBarBorderRadius": 0,
 "transitionDuration": 500,
 "paddingRight": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderRadius": 0,
 "height": "99.975%",
 "toolTipFontStyle": "normal",
 "minWidth": 1,
 "borderSize": 0,
 "progressLeft": 0,
 "playbackBarHeadBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipShadowOpacity": 1,
 "propagateClick": false,
 "toolTipTextShadowOpacity": 0,
 "vrPointerSelectionColor": "#FF6600",
 "toolTipFontFamily": "Arial",
 "playbackBarBorderSize": 0,
 "playbackBarBackgroundOpacity": 1,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowHorizontalLength": 0,
 "toolTipShadowHorizontalLength": 0,
 "playbackBarHeadShadowColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "toolTipShadowVerticalLength": 0,
 "firstTransitionDuration": 0,
 "paddingLeft": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "progressOpacity": 1,
 "progressBottom": 2,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "displayTooltipInTouchScreens": true,
 "playbackBarHeadShadowOpacity": 0.7,
 "vrPointerColor": "#FFFFFF",
 "transitionMode": "blending",
 "progressBarOpacity": 1,
 "playbackBarBorderColor": "#FFFFFF",
 "toolTipBorderSize": 1,
 "toolTipPaddingRight": 6,
 "progressBorderSize": 0,
 "toolTipPaddingLeft": 6,
 "toolTipPaddingTop": 4,
 "toolTipDisplayTime": 600,
 "progressBorderRadius": 0,
 "top": 0,
 "progressBackgroundColorRatios": [
  0.01
 ],
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarLeft": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "paddingTop": 0,
 "progressBarBorderColor": "#0066FF",
 "paddingBottom": 0,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadOpacity": 1,
 "playbackBarBottom": 0,
 "progressBackgroundColorDirection": "vertical",
 "toolTipShadowSpread": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipBorderColor": "#767676",
 "progressBorderColor": "#FFFFFF",
 "shadow": false,
 "data": {
  "name": "Floor Plan"
 },
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipShadowBlurRadius": 3,
 "toolTipOpacity": 1
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "children": [
  "this.IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E"
 ],
 "id": "Container_2F8A7686_0D4F_6B71_41A9_1A894413085C",
 "scrollBarMargin": 2,
 "width": "100%",
 "class": "Container",
 "layout": "absolute",
 "contentOpaque": false,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": false,
 "height": 140,
 "paddingBottom": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "header"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "Container_2A19EC4C_0D3B_DFF0_414D_37145C22C5BC",
 "scrollBarMargin": 2,
 "children": [
  "this.ViewerAreaLabeled_2A198C4C_0D3B_DFF0_419F_C9A785406D9C",
  "this.IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482",
  "this.IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510",
  "this.IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1"
 ],
 "class": "Container",
 "width": "100%",
 "layout": "absolute",
 "contentOpaque": false,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "Container photo"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "visible",
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "center",
 "scrollBarVisible": "rollOver",
 "id": "Container_06C5ABA5_1140_A63F_41A9_850CF958D0DB",
 "scrollBarMargin": 2,
 "children": [
  "this.Image_06C5BBA5_1140_A63F_41A7_E6D01D4CC397"
 ],
 "class": "Container",
 "width": "55%",
 "layout": "absolute",
 "contentOpaque": false,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundColor": [
  "#000000"
 ],
 "backgroundOpacity": 1,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 0,
 "backgroundColorRatios": [
  0
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "-left"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "Container_06C58BA5_1140_A63F_419D_EC83F94F8C54",
 "scrollBarMargin": 2,
 "children": [
  "this.Container_06C59BA5_1140_A63F_41B1_4B41E3B7D98D",
  "this.Container_06C46BA5_1140_A63F_4151_B5A20B4EA86A",
  "this.Container_06C42BA5_1140_A63F_4195_037A0687532F"
 ],
 "class": "Container",
 "width": "45%",
 "layout": "vertical",
 "contentOpaque": false,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 60,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundOpacity": 1,
 "minWidth": 460,
 "borderRadius": 0,
 "borderSize": 0,
 "gap": 0,
 "paddingTop": 20,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 20,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#0069A3",
 "data": {
  "name": "-right"
 },
 "scrollBarOpacity": 0.51,
 "overflow": "visible",
 "paddingLeft": 60,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "center",
 "maxHeight": 60,
 "maxWidth": 60,
 "id": "IconButton_06C40BA5_1140_A63F_41AC_FA560325FD81",
 "width": "25%",
 "class": "IconButton",
 "minHeight": 50,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 50,
 "mode": "push",
 "borderRadius": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_06C40BA5_1140_A63F_41AC_FA560325FD81_rollover.jpg",
 "propagateClick": false,
 "iconURL": "skin/IconButton_06C40BA5_1140_A63F_41AC_FA560325FD81.jpg",
 "paddingBottom": 0,
 "click": "this.setComponentVisibility(this.Container_06C41BA5_1140_A63F_41AE_B0CBD78DEFDC, false, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "transparencyActive": false,
 "height": "75%",
 "data": {
  "name": "X"
 },
 "paddingLeft": 0,
 "cursor": "hand",
 "pressedIconURL": "skin/IconButton_06C40BA5_1140_A63F_41AC_FA560325FD81_pressed.jpg"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "Container_7DB3E382_7065_343F_41C2_E1E6BB5BA055",
 "scrollBarMargin": 2,
 "width": "100%",
 "class": "Container",
 "layout": "absolute",
 "contentOpaque": false,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "height": 1,
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "line"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "click": "this.mainPlayList.set('selectedIndex', 0)",
 "fontColor": "#FFFFFF",
 "id": "Button_7DB31382_7065_343F_41D6_641BBE1B2562",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "class": "Button",
 "iconHeight": 32,
 "layout": "horizontal",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "borderSize": 0,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 50,
 "paddingBottom": 0,
 "label": "ACADEMIA",
 "fontStyle": "italic",
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": "26px",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "gap": 5,
 "data": {
  "name": "Button Tour Info"
 },
 "textDecoration": "none",
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "paddingLeft": 10,
 "cursor": "hand",
 "fontWeight": "normal",
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "Container_7DB30382_7065_343F_416C_8610BCBA9F50",
 "scrollBarMargin": 2,
 "width": "100%",
 "class": "Container",
 "layout": "absolute",
 "contentOpaque": false,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "height": 1,
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "line"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "click": "this.setPanoramaCameraWithSpot(this.PanoramaPlayListItem_E21CAD83_D0C1_3564_41DD_987799902460, -84.48979591836735, -5.877551020408168);; this.mainPlayList.set('selectedIndex', 21)",
 "fontColor": "#FFFFFF",
 "id": "Button_7DB33382_7065_343F_41B1_0B0F019C1828",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "class": "Button",
 "iconHeight": 32,
 "layout": "horizontal",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "borderSize": 0,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 50,
 "paddingBottom": 0,
 "label": "SALA MODALIDADES",
 "fontStyle": "italic",
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": "26px",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "gap": 23,
 "data": {
  "name": "Button Panorama List"
 },
 "textDecoration": "none",
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "paddingLeft": 10,
 "cursor": "hand",
 "fontWeight": "normal",
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "Container_7DB32382_7065_343F_419E_6594814C420F",
 "scrollBarMargin": 2,
 "width": "100%",
 "class": "Container",
 "layout": "absolute",
 "contentOpaque": false,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "height": 1,
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "line"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "click": "this.setPanoramaCameraWithSpot(this.PanoramaPlayListItem_E21C2D88_D0C1_3564_41E1_85CF605CD511, 96.97959183673471, -3.673469387755102);; this.mainPlayList.set('selectedIndex', 23)",
 "fontColor": "#FFFFFF",
 "id": "Button_7DB35382_7065_343F_41C5_CF0EAF3E4CFF",
 "pressedLabel": "Location",
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "class": "Button",
 "iconHeight": 32,
 "rollOverBackgroundOpacity": 0.8,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "borderSize": 0,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 50,
 "paddingBottom": 0,
 "label": "ARTES MARCIAIS",
 "fontStyle": "italic",
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": "26px",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "gap": 5,
 "layout": "horizontal",
 "data": {
  "name": "Button Location"
 },
 "textDecoration": "none",
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "paddingLeft": 10,
 "cursor": "hand",
 "fontWeight": "normal",
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "Container_7DB34382_7065_343F_41CB_A5B96E9749EE",
 "scrollBarMargin": 2,
 "width": "100%",
 "class": "Container",
 "layout": "absolute",
 "contentOpaque": false,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "height": 1,
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "line"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "click": "this.openLink('https://www.zanellafitness.com.br/', '_blank')",
 "fontColor": "#FFFFFF",
 "id": "Button_7DB37382_7065_343F_41CC_EC41ABCCDE1B",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "class": "Button",
 "iconHeight": 32,
 "layout": "horizontal",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "borderSize": 0,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 50,
 "paddingBottom": 0,
 "label": "SITE",
 "fontStyle": "italic",
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": "26px",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "gap": 5,
 "data": {
  "name": "Button Floorplan"
 },
 "textDecoration": "none",
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "paddingLeft": 10,
 "cursor": "hand",
 "fontWeight": "normal",
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "Container_7DBC9382_7065_343F_41CC_ED357655BB95",
 "scrollBarMargin": 2,
 "width": "100%",
 "class": "Container",
 "layout": "absolute",
 "contentOpaque": false,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "height": 1,
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "line"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "click": "this.openLink('https://www.instagram.com/zanellafitness/', '_blank')",
 "fontColor": "#FFFFFF",
 "id": "Button_7DBC8382_7065_343F_4183_17B44518DB40",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "class": "Button",
 "iconHeight": 32,
 "layout": "horizontal",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "borderSize": 0,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 50,
 "paddingBottom": 0,
 "label": "INSTAGRAM",
 "fontStyle": "italic",
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": "26px",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "gap": 5,
 "data": {
  "name": "Button Photoalbum"
 },
 "textDecoration": "none",
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "paddingLeft": 10,
 "cursor": "hand",
 "fontWeight": "normal",
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "Container_7DBCB382_7065_343F_41D8_AB382D384291",
 "scrollBarMargin": 2,
 "width": "100%",
 "class": "Container",
 "layout": "absolute",
 "contentOpaque": false,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "height": 1,
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "line"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "click": "this.openLink('https://pt-br.facebook.com/zanellafitness/', '_blank')",
 "fontColor": "#FFFFFF",
 "id": "Button_7DBCA382_7065_343F_41DB_48D975E3D9EC",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "class": "Button",
 "iconHeight": 32,
 "layout": "horizontal",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "borderSize": 0,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 50,
 "paddingBottom": 0,
 "label": "FACEBOOK",
 "fontStyle": "italic",
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": "26px",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "gap": 5,
 "data": {
  "name": "Button Contact"
 },
 "textDecoration": "none",
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "paddingLeft": 10,
 "cursor": "hand",
 "fontWeight": "normal",
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "Container_7DBCD382_7065_343F_41D8_FC14DFF91DA9",
 "scrollBarMargin": 2,
 "width": "100%",
 "class": "Container",
 "layout": "absolute",
 "contentOpaque": false,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "height": 1,
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "line"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "click": "this.openLink('http://wa.me/5547991513016', '_blank')",
 "fontColor": "#FFFFFF",
 "id": "Button_F8EC2AE9_D0C3_1CA7_41E4_42A68847E9A2",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "class": "Button",
 "iconHeight": 32,
 "layout": "horizontal",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "borderSize": 0,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 50,
 "paddingBottom": 0,
 "label": "WHATSAPP",
 "fontStyle": "italic",
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": "26px",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "gap": 5,
 "data": {
  "name": "Button Contact"
 },
 "textDecoration": "none",
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "paddingLeft": 10,
 "cursor": "hand",
 "fontWeight": "normal",
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "Container_F9844F88_D0C3_1564_41DB_87FD89C84208",
 "scrollBarMargin": 2,
 "width": "100%",
 "class": "Container",
 "layout": "absolute",
 "contentOpaque": false,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "height": 1,
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "line"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "click": "this.openLink('tel:04738042105', '_blank')",
 "fontColor": "#FFFFFF",
 "id": "Button_F80D86CA_D0C3_34E4_41B5_9065761A793E",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "class": "Button",
 "iconHeight": 32,
 "layout": "horizontal",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "borderSize": 0,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 50,
 "paddingBottom": 0,
 "label": "TELEFONE",
 "fontStyle": "italic",
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": "26px",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "gap": 5,
 "data": {
  "name": "Button Contact"
 },
 "textDecoration": "none",
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "paddingLeft": 10,
 "cursor": "hand",
 "fontWeight": "normal",
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "Container_F9AED231_D0C3_0FA4_41E0_C09B22360F8E",
 "scrollBarMargin": 2,
 "width": "100%",
 "class": "Container",
 "layout": "absolute",
 "contentOpaque": false,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "height": 1,
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "line"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "Container_7DB2F382_7065_343F_41C8_85C6AE9C717F",
 "scrollBarMargin": 2,
 "width": 40,
 "class": "Container",
 "layout": "horizontal",
 "contentOpaque": false,
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "height": 2,
 "backgroundOpacity": 1,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "backgroundColor": [
  "#5CA1DE"
 ],
 "paddingBottom": 0,
 "backgroundColorRatios": [
  0
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "blue line"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "visible",
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "id": "HTMLText_7DB2E382_7065_343F_41C2_951F708170F1",
 "scrollBarMargin": 2,
 "width": "100%",
 "class": "HTMLText",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 68.4,
 "paddingBottom": 0,
 "click": "this.openLink('https://goo.gl/maps/z4QEx2H7BEWQHGcn6', '_blank')",
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#ffffff;font-size:19px;font-family:'Oswald Regular';\"><I>Academia Zanella Fitnes</I></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#ffffff;font-size:16px;font-family:'Oswald Regular';\"><I>Rua Inambu, 3015 - Costa e Silva</I></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#ffffff;font-size:16px;font-family:'Oswald Regular';\"><I>Joinville - SC</I></SPAN></SPAN></DIV></div>",
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText47602"
 },
 "scrollBarOpacity": 0.5,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver"
},
{
 "shadow": false,
 "horizontalAlign": "center",
 "maxHeight": 80,
 "maxWidth": 80,
 "id": "IconButton_7DB21382_7065_343F_41B1_484EDBCD16A4",
 "width": 42,
 "class": "IconButton",
 "minHeight": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "height": 42,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_7DB21382_7065_343F_41B1_484EDBCD16A4_rollover.png",
 "propagateClick": true,
 "iconURL": "skin/IconButton_7DB21382_7065_343F_41B1_484EDBCD16A4.png",
 "paddingBottom": 0,
 "click": "this.setComponentVisibility(this.Container_7DB20382_7065_343F_4186_6E0B0B3AFF36, false, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "transparencyActive": true,
 "data": {
  "name": "IconButton collapse"
 },
 "paddingLeft": 0,
 "cursor": "hand"
},
{
 "shadow": false,
 "horizontalAlign": "center",
 "maxHeight": 1000,
 "maxWidth": 2000,
 "id": "Image_062A182F_1140_E20B_41B0_9CB8FFD6AA5A",
 "left": "0%",
 "width": "100%",
 "class": "Image",
 "url": "skin/Image_062A182F_1140_E20B_41B0_9CB8FFD6AA5A.jpg",
 "minHeight": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "top": "0%",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 0,
 "scaleMode": "fit_outside",
 "data": {
  "name": "Image"
 },
 "paddingLeft": 0
},
{
 "shadow": false,
 "horizontalAlign": "right",
 "scrollBarVisible": "rollOver",
 "id": "Container_062A3830_1140_E215_4195_1698933FE51C",
 "scrollBarMargin": 2,
 "width": "100%",
 "class": "Container",
 "layout": "horizontal",
 "contentOpaque": false,
 "minHeight": 0,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "height": 50,
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "gap": 0,
 "paddingTop": 20,
 "propagateClick": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "Container space"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "Container_062A2830_1140_E215_41AA_EB25B7BD381C",
 "scrollBarMargin": 2,
 "children": [
  "this.HTMLText_062AD830_1140_E215_41B0_321699661E7F",
  "this.Button_062AF830_1140_E215_418D_D2FC11B12C47"
 ],
 "class": "Container",
 "width": "100%",
 "layout": "vertical",
 "contentOpaque": false,
 "minHeight": 300,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundOpacity": 0.3,
 "minWidth": 100,
 "borderRadius": 0,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 10,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#E73B2C",
 "data": {
  "name": "Container text"
 },
 "scrollBarOpacity": 0.79,
 "overflow": "scroll",
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "Container_062AE830_1140_E215_4180_196ED689F4BD",
 "scrollBarMargin": 2,
 "width": 370,
 "class": "Container",
 "layout": "horizontal",
 "contentOpaque": false,
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "height": 30,
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "Container space"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "right",
 "maxHeight": 60,
 "maxWidth": 60,
 "id": "IconButton_38922473_0C06_2593_4199_C585853A1AB3",
 "width": "100%",
 "class": "IconButton",
 "right": 20,
 "minHeight": 50,
 "verticalAlign": "top",
 "paddingRight": 0,
 "top": 20,
 "backgroundOpacity": 0,
 "minWidth": 50,
 "mode": "push",
 "borderRadius": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_38922473_0C06_2593_4199_C585853A1AB3_rollover.jpg",
 "propagateClick": false,
 "iconURL": "skin/IconButton_38922473_0C06_2593_4199_C585853A1AB3.jpg",
 "paddingBottom": 0,
 "click": "this.setComponentVisibility(this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15, false, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "transparencyActive": false,
 "height": "36.14%",
 "data": {
  "name": "IconButton X"
 },
 "paddingLeft": 0,
 "cursor": "hand",
 "pressedIconURL": "skin/IconButton_38922473_0C06_2593_4199_C585853A1AB3_pressed.jpg"
},
{
 "shadow": false,
 "horizontalAlign": "right",
 "maxHeight": 60,
 "maxWidth": 60,
 "id": "IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E",
 "width": "100%",
 "class": "IconButton",
 "right": 20,
 "minHeight": 50,
 "verticalAlign": "top",
 "paddingRight": 0,
 "top": 20,
 "backgroundOpacity": 0,
 "minWidth": 50,
 "mode": "push",
 "borderRadius": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E_rollover.jpg",
 "propagateClick": false,
 "iconURL": "skin/IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E.jpg",
 "paddingBottom": 0,
 "click": "this.setComponentVisibility(this.Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41, false, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "transparencyActive": false,
 "height": "36.14%",
 "data": {
  "name": "IconButton X"
 },
 "paddingLeft": 0,
 "cursor": "hand",
 "pressedIconURL": "skin/IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E_pressed.jpg"
},
{
 "playbackBarHeight": 10,
 "toolTipFontSize": 12,
 "id": "ViewerAreaLabeled_2A198C4C_0D3B_DFF0_419F_C9A785406D9C",
 "left": "0%",
 "playbackBarBackgroundColorDirection": "vertical",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "toolTipTextShadowColor": "#000000",
 "class": "ViewerArea",
 "width": "100%",
 "toolTipFontWeight": "normal",
 "toolTipTextShadowBlurRadius": 3,
 "toolTipPaddingBottom": 4,
 "progressBarBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "playbackBarRight": 0,
 "playbackBarProgressBorderSize": 0,
 "minHeight": 1,
 "playbackBarHeadShadowVerticalLength": 0,
 "playbackBarBorderRadius": 0,
 "transitionDuration": 500,
 "paddingRight": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderRadius": 0,
 "height": "100%",
 "toolTipFontStyle": "normal",
 "minWidth": 1,
 "borderSize": 0,
 "progressLeft": 0,
 "playbackBarHeadBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipShadowOpacity": 1,
 "propagateClick": false,
 "toolTipTextShadowOpacity": 0,
 "vrPointerSelectionColor": "#FF6600",
 "toolTipFontFamily": "Arial",
 "playbackBarBorderSize": 0,
 "playbackBarBackgroundOpacity": 1,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowHorizontalLength": 0,
 "toolTipShadowHorizontalLength": 0,
 "playbackBarHeadShadowColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "toolTipShadowVerticalLength": 0,
 "firstTransitionDuration": 0,
 "paddingLeft": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "progressOpacity": 1,
 "progressBottom": 2,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "displayTooltipInTouchScreens": true,
 "playbackBarHeadShadowOpacity": 0.7,
 "vrPointerColor": "#FFFFFF",
 "transitionMode": "blending",
 "progressBarOpacity": 1,
 "playbackBarBorderColor": "#FFFFFF",
 "toolTipBorderSize": 1,
 "toolTipPaddingRight": 6,
 "progressBorderSize": 0,
 "toolTipPaddingLeft": 6,
 "toolTipPaddingTop": 4,
 "toolTipDisplayTime": 600,
 "progressBorderRadius": 0,
 "top": "0%",
 "progressBackgroundColorRatios": [
  0.01
 ],
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarLeft": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "paddingTop": 0,
 "progressBarBorderColor": "#0066FF",
 "paddingBottom": 0,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadOpacity": 1,
 "playbackBarBottom": 0,
 "progressBackgroundColorDirection": "vertical",
 "toolTipShadowSpread": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipBorderColor": "#767676",
 "progressBorderColor": "#FFFFFF",
 "shadow": false,
 "data": {
  "name": "Viewer photoalbum 1"
 },
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipShadowBlurRadius": 3,
 "toolTipOpacity": 1
},
{
 "shadow": false,
 "horizontalAlign": "center",
 "maxHeight": 60,
 "maxWidth": 60,
 "id": "IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482",
 "left": 10,
 "width": "14.22%",
 "class": "IconButton",
 "minHeight": 50,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "top": "20%",
 "backgroundOpacity": 0,
 "minWidth": 50,
 "mode": "push",
 "borderRadius": 0,
 "bottom": "20%",
 "borderSize": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482_rollover.png",
 "propagateClick": true,
 "iconURL": "skin/IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482.png",
 "paddingBottom": 0,
 "transparencyActive": false,
 "data": {
  "name": "IconButton <"
 },
 "paddingLeft": 0,
 "cursor": "hand",
 "pressedIconURL": "skin/IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482_pressed.png"
},
{
 "shadow": false,
 "horizontalAlign": "center",
 "maxHeight": 60,
 "maxWidth": 60,
 "id": "IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510",
 "width": "14.22%",
 "class": "IconButton",
 "right": 10,
 "minHeight": 50,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "top": "20%",
 "backgroundOpacity": 0,
 "minWidth": 50,
 "mode": "push",
 "borderRadius": 0,
 "bottom": "20%",
 "borderSize": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510_rollover.png",
 "propagateClick": true,
 "iconURL": "skin/IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510.png",
 "paddingBottom": 0,
 "transparencyActive": false,
 "data": {
  "name": "IconButton >"
 },
 "paddingLeft": 0,
 "cursor": "hand",
 "pressedIconURL": "skin/IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510_pressed.png"
},
{
 "shadow": false,
 "horizontalAlign": "right",
 "maxHeight": 60,
 "maxWidth": 60,
 "id": "IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1",
 "width": "10%",
 "class": "IconButton",
 "right": 20,
 "minHeight": 50,
 "verticalAlign": "top",
 "paddingRight": 0,
 "top": 20,
 "backgroundOpacity": 0,
 "minWidth": 50,
 "mode": "push",
 "borderRadius": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1_rollover.jpg",
 "propagateClick": true,
 "iconURL": "skin/IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1.jpg",
 "paddingBottom": 0,
 "click": "this.setComponentVisibility(this.Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E, false, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "transparencyActive": false,
 "height": "10%",
 "data": {
  "name": "IconButton X"
 },
 "paddingLeft": 0,
 "cursor": "hand",
 "pressedIconURL": "skin/IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1_pressed.jpg"
},
{
 "shadow": false,
 "horizontalAlign": "center",
 "maxHeight": 1000,
 "maxWidth": 2000,
 "id": "Image_06C5BBA5_1140_A63F_41A7_E6D01D4CC397",
 "left": "0%",
 "width": "100%",
 "class": "Image",
 "url": "skin/Image_06C5BBA5_1140_A63F_41A7_E6D01D4CC397.jpg",
 "minHeight": 1,
 "verticalAlign": "bottom",
 "paddingRight": 0,
 "top": "0%",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 0,
 "scaleMode": "fit_outside",
 "data": {
  "name": "Image40635"
 },
 "paddingLeft": 0
},
{
 "shadow": false,
 "horizontalAlign": "right",
 "scrollBarVisible": "rollOver",
 "id": "Container_06C59BA5_1140_A63F_41B1_4B41E3B7D98D",
 "scrollBarMargin": 2,
 "width": "100%",
 "class": "Container",
 "layout": "horizontal",
 "contentOpaque": false,
 "minHeight": 0,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "gap": 0,
 "paddingTop": 20,
 "propagateClick": false,
 "height": "5%",
 "paddingBottom": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "Container space"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "Container_06C46BA5_1140_A63F_4151_B5A20B4EA86A",
 "scrollBarMargin": 2,
 "children": [
  "this.HTMLText_0B42C466_11C0_623D_4193_9FAB57A5AC33",
  "this.Container_0D9BF47A_11C0_E215_41A4_A63C8527FF9C"
 ],
 "class": "Container",
 "width": "100%",
 "layout": "vertical",
 "contentOpaque": false,
 "minHeight": 520,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundOpacity": 0.3,
 "minWidth": 100,
 "borderRadius": 0,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 30,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#E73B2C",
 "data": {
  "name": "Container text"
 },
 "scrollBarOpacity": 0.79,
 "overflow": "scroll",
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "Container_06C42BA5_1140_A63F_4195_037A0687532F",
 "scrollBarMargin": 2,
 "width": 370,
 "class": "Container",
 "layout": "horizontal",
 "contentOpaque": false,
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "height": 40,
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "Container space"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "id": "HTMLText_062AD830_1140_E215_41B0_321699661E7F",
 "scrollBarMargin": 2,
 "width": "100%",
 "class": "HTMLText",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "paddingRight": 10,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 20,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:8.44vh;font-family:'Bebas Neue Bold';\">___</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:4.86vh;font-family:'Oswald';\"><B><I>LOREM IPSUM</I></B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:4.86vh;font-family:'Oswald';\"><B><I>DOLOR SIT AME</I></B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:2.58vh;font-family:'Oswald';\"><B>CONSECTETUR ADIPISCING ELIT. MORBI BIBENDUM PHARETRA LOREM, ACCUMSAN SAN NULLA.</B></SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.14vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.14vh;font-family:Arial, Helvetica, sans-serif;\"/></p><p STYLE=\"margin:0; line-height:1.14vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.14vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.14vh;font-family:Arial, Helvetica, sans-serif;\">Mauris aliquet neque quis libero consequat vestibulum. Donec lacinia consequat dolor viverra sagittis. Praesent consequat porttitor risus, eu condimentum nunc. Proin et velit ac sapien luctus efficitur egestas ac augue. Nunc dictum, augue eget eleifend interdum, quam libero imperdiet lectus, vel scelerisque turpis lectus vel ligula. Duis a porta sem. Maecenas sollicitudin nunc id risus fringilla, a pharetra orci iaculis. Aliquam turpis ligula, tincidunt sit amet consequat ac, imperdiet non dolor.</SPAN></DIV><p STYLE=\"margin:0; line-height:1.14vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.14vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.14vh;font-family:Arial, Helvetica, sans-serif;\">Integer gravida dui quis euismod placerat. Maecenas quis accumsan ipsum. Aliquam gravida velit at dolor mollis, quis luctus mauris vulputate. Proin condimentum id nunc sed sollicitudin.</SPAN></DIV><p STYLE=\"margin:0; line-height:2.58vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.14vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:2.58vh;font-family:'Oswald';\"><B><I>DONEC FEUGIAT:</I></B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.14vh;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.72vh;\"> </SPAN>\u2022 Nisl nec mi sollicitudin facilisis </SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.14vh;font-family:Arial, Helvetica, sans-serif;\"> \u2022 Nam sed faucibus est.</SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.14vh;font-family:Arial, Helvetica, sans-serif;\"> \u2022 Ut eget lorem sed leo.</SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.14vh;font-family:Arial, Helvetica, sans-serif;\"> \u2022 Sollicitudin tempor sit amet non urna. </SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.14vh;font-family:Arial, Helvetica, sans-serif;\"> \u2022 Aliquam feugiat mauris sit amet.</SPAN></DIV><p STYLE=\"margin:0; line-height:2.58vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.14vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:2.58vh;font-family:'Oswald';\"><B><I>LOREM IPSUM:</I></B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:2.72vh;font-family:'Oswald';\"><B>$150,000</B></SPAN></SPAN></DIV></div>",
 "scrollBarColor": "#04A3E1",
 "data": {
  "name": "HTMLText"
 },
 "scrollBarOpacity": 0.5,
 "paddingLeft": 10,
 "scrollBarVisible": "rollOver"
},
{
 "shadow": false,
 "horizontalAlign": "center",
 "fontColor": "#FFFFFF",
 "id": "Button_062AF830_1140_E215_418D_D2FC11B12C47",
 "rollOverBackgroundOpacity": 1,
 "pressedBackgroundOpacity": 1,
 "width": 180,
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "class": "Button",
 "iconHeight": 32,
 "pressedBackgroundColor": [
  "#000000"
 ],
 "layout": "horizontal",
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "verticalAlign": "middle",
 "pressedBackgroundColorRatios": [
  0
 ],
 "borderColor": "#000000",
 "paddingRight": 0,
 "height": 50,
 "backgroundOpacity": 0.7,
 "minWidth": 1,
 "mode": "push",
 "backgroundColor": [
  "#04A3E1"
 ],
 "borderSize": 0,
 "borderRadius": 50,
 "shadowSpread": 1,
 "label": "LOREM IPSUM",
 "paddingTop": 0,
 "propagateClick": false,
 "fontSize": "2.39vh",
 "paddingBottom": 0,
 "gap": 5,
 "fontStyle": "italic",
 "backgroundColorRatios": [
  0
 ],
 "data": {
  "name": "Button31015"
 },
 "textDecoration": "none",
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "paddingLeft": 0,
 "cursor": "hand",
 "fontWeight": "bold",
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "id": "HTMLText_0B42C466_11C0_623D_4193_9FAB57A5AC33",
 "scrollBarMargin": 2,
 "width": "100%",
 "class": "HTMLText",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "46%",
 "paddingBottom": 10,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:8.44vh;font-family:'Bebas Neue Bold';\">___</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:4.86vh;font-family:'Oswald';\"><B><I>LOREM IPSUM</I></B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:4.86vh;font-family:'Oswald';\"><B><I>DOLOR SIT AMET</I></B></SPAN></SPAN></DIV></div>",
 "scrollBarColor": "#04A3E1",
 "data": {
  "name": "HTMLText18899"
 },
 "scrollBarOpacity": 0,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "Container_0D9BF47A_11C0_E215_41A4_A63C8527FF9C",
 "scrollBarMargin": 2,
 "children": [
  "this.Image_0B48D65D_11C0_6E0F_41A2_4D6F373BABA0",
  "this.HTMLText_0B4B0DC1_11C0_6277_41A4_201A5BB3F7AE"
 ],
 "class": "Container",
 "width": "100%",
 "layout": "horizontal",
 "contentOpaque": false,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "75%",
 "paddingBottom": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "- content"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical"
},
{
 "shadow": false,
 "horizontalAlign": "left",
 "maxHeight": 200,
 "maxWidth": 200,
 "id": "Image_0B48D65D_11C0_6E0F_41A2_4D6F373BABA0",
 "width": "25%",
 "class": "Image",
 "url": "skin/Image_0B48D65D_11C0_6E0F_41A2_4D6F373BABA0.jpg",
 "minHeight": 1,
 "verticalAlign": "top",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 0,
 "scaleMode": "fit_inside",
 "data": {
  "name": "agent photo"
 },
 "paddingLeft": 0
},
{
 "shadow": false,
 "id": "HTMLText_0B4B0DC1_11C0_6277_41A4_201A5BB3F7AE",
 "scrollBarMargin": 2,
 "width": "75%",
 "class": "HTMLText",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "paddingRight": 10,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 10,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:2.58vh;font-family:'Oswald';\"><B><I>JOHN DOE</I></B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:2.43vh;font-family:'Oswald';\"><I>Licensed Real Estate Salesperson</I></SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.86vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.14vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-size:1.86vh;font-family:'Oswald';\"><I>Tlf.: +11 111 111 111</I></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-size:1.86vh;font-family:'Oswald';\"><I>jhondoe@realestate.com</I></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-size:1.86vh;font-family:'Oswald';\"><I>www.loremipsum.com</I></SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.14vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.14vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.14vh;font-family:Arial, Helvetica, sans-serif;\">Mauris aliquet neque quis libero consequat vestibulum. Donec lacinia consequat dolor viverra sagittis. Praesent consequat porttitor risus, eu condimentum nunc. Proin et velit ac sapien luctus efficitur egestas ac augue. Nunc dictum, augue eget eleifend interdum, quam libero imperdiet lectus, vel scelerisque turpis lectus vel ligula. Duis a porta sem. Maecenas sollicitudin nunc id risus fringilla, a pharetra orci iaculis. Aliquam turpis ligula, tincidunt sit amet consequat ac, imperdiet non dolor.</SPAN></DIV></div>",
 "scrollBarColor": "#04A3E1",
 "data": {
  "name": "HTMLText19460"
 },
 "scrollBarOpacity": 0.5,
 "paddingLeft": 10,
 "scrollBarVisible": "rollOver"
}],
 "desktopMipmappingEnabled": false,
 "paddingTop": 0,
 "propagateClick": true,
 "mobileMipmappingEnabled": false,
 "paddingBottom": 0,
 "gap": 10,
 "backgroundPreloadEnabled": true,
 "scrollBarColor": "#000000",
 "height": "100%",
 "mouseWheelEnabled": true,
 "vrPolyfillScale": 0.5,
 "data": {
  "name": "Player468"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "visible",
 "paddingLeft": 0
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
