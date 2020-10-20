/*©agpl*************************************************************************
*                                                                              *
* This file is part of FRIEND UNIFYING PLATFORM.                               *
* Copyright (c) Friend Software Labs AS. All rights reserved.                  *
*                                                                              *
* Licensed under the Source EULA. Please refer to the copy of the GNU Affero   *
* General Public License, found in the file license_agpl.txt.                  *
*                                                                              *
*****************************************************************************©*/

var ShowLog = false;

// Start!
Application.run = function( msg )
{ 
	initGui();/* initTest();*/
	
	this.WindowSize = {
		width  : document.body.clientWidth,
		height : document.body.clientHeight
	};
	
	document.body.setAttribute( 'onresize', 'CheckWindowSize()' );
}

// Just initialize the GUI!
function initGui()
{
	// Let's get some charts!
	Include( '/webclient/3rdparty/Chart.bundle.min.js', function()
	{
		// And then start!
		refreshSidebar();
		refreshStatistics();
		
		// Init responsive layout
		Friend.responsive.init();
	} );
}

// Side bar being refreshed
function refreshSidebar( show )
{
	console.log( 'to show whole list use: refreshSidebar( true );' );
	
	console.log( 'ShowLog = true; to show debug console.log output' );
	
	var isAdmin = Application.getUserLevel() == 'admin' ? true : false;

	Application.mods = {
		'Server': {
			'Status': {
				icon: 'fa-info-circle',
				showing: isAdmin,
				display: ( show ? true : false )
			},
			'Configuration': {
				icon: 'fa-gear',
				showing: isAdmin,
				display: ( show ? true : false )
			},
			'Certificates': {
				icon: 'fa-certificate',
				showing: isAdmin,
				display: ( show ? true : false )
			},
			'Printers': {
				icon: 'fa-print',
				showing: isAdmin,
				display: ( show ? true : false )
			},
			'Backup': {
				icon: 'fa-cloud-download',
				showing: isAdmin,
				display: ( show ? true : false )
			},
			'Logs': {
				icon: 'fa-list-alt',
				showing: isAdmin,
				display: ( show ? true : false )
			}
		},
		'Services': {
			'Status': {
				icon: 'fa-info-circle',
				showing: isAdmin,
				display: ( show ? true : false )
			}
		},
		'Applications': {
			'Applications': {
				icon: 'fa-info-circle',
				showing: isAdmin,
				display: ( show ? true : false )
			},
			'Liberator': {
				icon: 'fa-info-circle',
				name: i18n( 'i18n_link_friendrds' ),
				showing: isAdmin,
				display: true,
				childs: /*false*/{
					'Servers': { 
						icon: 'fa-info-circle',
						name: i18n( 'i18n_link_servers' ),
						showing: isAdmin,
						display: true
					},
					'Users': {
						icon: 'fa-info-circle',
						name: i18n( 'i18n_link_users' ),
						showing: isAdmin,
						display: true
					}
				} 
			}
		},
		'Accounts': {
			'Status': {
				icon: 'fa-info-circle',
				condition: isAdmin,
				display: ( show ? true : false )
			},
			'Users': {
				icon: 'fa-user-circle-o',
				showing: isAdmin,
				display: true,
				permissions: [ 
					
					// Old
					
					'PERM_USER_GLOBAL', 
					'PERM_USER_WORKGROUP', 
					
					// New
					
					'PERM_USER_READ_GLOBAL', 
					'PERM_USER_READ_IN_WORKGROUP' 
					 
				],
				init: true
			},
			'Workgroups': {
				icon: 'fa-users',
				showing: isAdmin,
				display: true,
				permissions: [ 
					
					// Old
					
					'PERM_WORKGROUP_GLOBAL', 
					'PERM_WORKGROUP_WORKGROUP', 
					
					// New
					
					'PERM_WORKGROUP_READ_GLOBAL', 
					'PERM_WORKGROUP_READ_IN_WORKGROUP' 
					
				]
			},
			'Roles': {
				icon: 'fa-user-secret',
				showing: isAdmin,
				display: true,
				permissions: [ 
					
					// Old
					
					'PERM_ROLE_GLOBAL', 
					'PERM_ROLE_WORKGROUP', 
					
					// New
					
					'PERM_ROLE_READ_GLOBAL', 
					'PERM_ROLE_READ_IN_WORKGROUP' 
					
				]
			},
			'Templates': {
				icon: 'fa-file-text',
				showing: isAdmin,
				display: true,
				permissions: [ 
					
					// Old
					
					'PERM_TEMPLATE_GLOBAL', 
					'PERM_TEMPLATE_WORKGROUP', 
					
					// New
					
					'PERM_TEMPLATE_READ_GLOBAL', 
					'PERM_TEMPLATE_READ_IN_WORKGROUP' 
					
				]
			}
		}
	};
	
	var container = ge( 'GuiSidebar' );
	var eles = container.getElementsByClassName( 'DashboardHeading' );
	var headings = {};
	var mods = Application.mods;
	
	// See if there are plugins ...
	
	getSystemSettings( function( data )
	{
		if( ShowLog ) console.log( data );
		
		// add plugins if found ...
		if( data )
		{
			for( var mod in mods )
			{
				var found = {};
				
				for( var key in data )
				{
					if( key.indexOf( '_' ) >= 0 )
					{
						var parts = key.split( '_' );
						
						if( parts.length >= 3 )
						{
							if( parts[0] == mod.toLowerCase() )
							{
								if( !found[ mod.toLowerCase() ] || !found[ mod.toLowerCase() ][ parts[1] ] )
								{
									var plugin = null; 
									
									var obj = {
										icon        : 'fa-info-circle',
										showing     : isAdmin,
										display     : true,
										permissions : null,
									};
									
									if( data[ mod.toLowerCase() + '_' + parts[1] + '_title_en' ] )
									{
										plugin = data[ mod.toLowerCase() + '_' + parts[1] + '_title_en' ];
									}
									if( data[ mod.toLowerCase() + '_' + parts[1] + '_icon' ] )
									{
										//obj[ 'icon' ] = data[ mod.toLowerCase() + '_' + parts[1] + '_icon' ];
									}
									if( data[ mod.toLowerCase() + '_' + parts[1] + '_action' ] )
									{
										obj[ 'action' ] = data[ mod.toLowerCase() + '_' + parts[1] + '_action' ];
									}
									
									if( plugin && mods[mod] && !mods[mod][plugin] )
									{
										mods[mod][plugin] = obj;
									}
									
									if( !found[ mod.toLowerCase() ] )
									{
										found[ mod.toLowerCase() ] = {};
									}
									
									found[ mod.toLowerCase() ][ parts[1] ] = true;
								}
							}
						}
					}
				}
			}
		}
		
		// Go through all modules
		for( var a in mods )
		{
			var found = false;
			for( var b = 0; b < eles.length; b++ )
			{
				if( eles[b].id == 'Heading_' + a )
				{
					headings[ a ] = eles[b];
					found = true;
					break;
				}
			}
		
			// Create header
			if( !found )
			{
				headings[ a ] = document.createElement( 'div' );
				headings[ a ].innerHTML = '<div class="PaddingLeft PaddingTop PaddingRight"><h3 class="Negative PaddingLeft PaddingRight"><strong>' + a + '</strong></h3></div>';
				var elements = document.createElement( 'div' );
				elements.className = 'Elements List';
				headings[ a ].elements = headings[ a ].appendChild( elements );
			}
		
			// Clear elements
			headings[ a ].elements.innerHTML = '';
		
			var heading_children = 0;
			
			// Populate children
			for( var b in mods[ a ] )
			{
				var ch = mods[ a ][ b ];
				var ptag = document.createElement( 'div' );
				var atag = document.createElement( 'a' );
				atag.innerHTML = ( ch.name ? ch.name : b );
				//ptag.className = 'HRow BackgroundNegativeAlt PaddingLeft PaddingSmallTop PaddingRight PaddingSmallBottom';
				ptag.className = 'HRow BackgroundNegative PaddingLeft PaddingSmallTop PaddingRight PaddingSmallBottom';
				ptag.appendChild( atag );
			
				if( !ch.display ) continue;
			
				// If we have no showing check permissions
				if( !ch.showing )
				{
					if( ch.permissions )
					{
						var access = false;
				
						for( var i in ch.permissions )
						{
							if( ch.permissions[i] && Application.checkAppPermission( ch.permissions[i] ) )
							{
								access = true;
							}
						}
				
						if( !access ) continue;
					}
					else continue;
				}
				
				if( ch.icon )
				{
					//atag.classList.add( 'IconMedium', ch.icon );
					//atag.classList.add( 'IconSmall', ch.icon );
					//atag.classList.add( 'Negative', ch.icon );
					//atag.classList.add( 'PaddingLeft', ch.icon );
					//atag.classList.add( 'PaddingRight', ch.icon );
					atag.className = 'IconSmall ' + ch.icon + ' Negative PaddingLeft PaddingRight';
					atag.innerHTML = '&nbsp;&nbsp;&nbsp;' + atag.innerHTML;
					
					if( !ch.childs )
					{
						( function( module, sect, ch, ele, act )
						{
							ele.onclick = function()
							{
								// Update latest changes to permissions before showing page ...
								Application.checkAppPermission( false, function()
								{
									if( ge( 'GuiSidebar' ) )
									{
										var list = ge( 'GuiSidebar' ).getElementsByTagName( 'div' );
								
										if( list.length > 0 )
										{
											for( var a = 0; a < list.length; a++ )
											{
												if( list[a] && list[a].className && list[a].className.indexOf( ' Selected' ) >= 0 )
												{
													list[a].className = ( list[a].className.split( ' Selected' ).join( '' ) );
												}
											}
										}
									}
							
									ele.parentNode.className = ( ele.parentNode.className.split( ' Selected' ).join( '' ) + ' Selected' );
									
									setGUISection( module, sect, false, act );
								} );
							}
					
							if( ch.init )
							{
								ele.onclick();
							}
					
						} )( a, b, ch, atag, ch.action );
					}
				}
				
				headings[ a ].elements.appendChild( ptag );
				
				// Add sub children if found ...
				if( ch.icon && ch.childs )
				{
					
					for( var c in ch.childs )
					{
						var chc = ch.childs[ c ];
						var ptag = document.createElement( 'div' );
						var dtag = document.createElement( 'div' );
						var ctag = document.createElement( 'div' );
						var atag = document.createElement( 'a' );
						atag.innerHTML = ( chc.name ? chc.name : c );
						ptag.className = 'HRow BackgroundNegative PaddingLeft PaddingSmallTop PaddingRight PaddingSmallBottom';
						dtag.className = 'PaddingLeft BackgroundNegative';
						ctag.className = 'PaddingLeft BackgroundNegative';
						dtag.appendChild( atag );
						ctag.appendChild( dtag );
						ptag.appendChild( ctag );
						
						if( !chc.display ) continue;
					
						// If we have no showing check permissions
						if( !chc.showing )
						{
							if( chc.permissions )
							{
								var access = false;
				
								for( var i in chc.permissions )
								{
									if( chc.permissions[i] && Application.checkAppPermission( chc.permissions[i] ) )
									{
										access = true;
									}
								}
				
								if( !access ) continue;
							}
							else continue;
						}
					
						if( chc.icon )
						{
							atag.className = 'IconSmall ' + chc.icon + ' Negative PaddingLeft PaddingRight';
							atag.innerHTML = '&nbsp;&nbsp;&nbsp;' + atag.innerHTML;
							
							( function( module, sect, child, ch, ele, act )
							{
								ele.onclick = function()
								{
									// Update latest changes to permissions before showing page ...
									Application.checkAppPermission( false, function()
									{
										if( ge( 'GuiSidebar' ) )
										{
											var list = ge( 'GuiSidebar' ).getElementsByTagName( 'div' );
							
											if( list.length > 0 )
											{
												for( var a = 0; a < list.length; a++ )
												{
													if( list[a] && list[a].className && list[a].className.indexOf( ' Selected' ) >= 0 )
													{
														list[a].className = ( list[a].className.split( ' Selected' ).join( '' ) );
													}
												}
											}
										}
						
										ele.parentNode.className = ( ele.parentNode.className.split( ' Selected' ).join( '' ) + ' Selected' );
						
										setGUISection( module, sect, child, act );
									} );
								}
				
								if( chc.init )
								{
									ele.onclick();
								}
				
							} )( a, b, c, ch, atag, chc.action );
							
						}
						
						headings[ a ].elements.appendChild( ptag );
						
					}
					
				}
				
				heading_children++;
			}
		
			// Add header with contents
			if( !found && heading_children > 0 )
			{
				container.appendChild( headings[ a ] );
			}
		}
		
	} );
	
	
}

function getSystemSettings( callback )
{
	var ms = new Module( 'system' );
	ms.onExecuted = function( stat, resp )
	{
		var out = {};
		
		if( stat == 'ok' )
		{
			try
			{
				 resp = JSON.parse( resp );	
				 resp = JSON.parse( resp[0].Data );
				 
				 if( resp )
				 {
				 	out = resp;
				 }
			}
			catch( e ){  }
		}
		
		if( callback )
		{
			return callback( out );
		}
	}
	ms.execute( 'getsystemsetting', { 'type' : 'system', 'key' : 'adminapp' } );
}

// Refreshing general statistics
function refreshStatistics()
{
}

// Sets the gui for a section in the app
function setGUISection( module, section, child, action )
{
	var found = false;
	if( typeof( Application.mods[ module ] ) != 'undefined' )
	{
		for( var a in Application.mods[ module ] )
		{
			if( a == section )
			{
				found = true;
			}
		}
	}
	if( !found ) return;
	
	// Get custom plugin data from module
	
	if( action && action.indexOf( '/' ) >= 0 )
	{
		var action = action.split( '/' );
		
		if( action[0] && action[1] )
		{
			ge( 'GuiContent' ).innerHTML = '...';
			if( ShowLog ) console.log( action );
			var m = new Module( action[0] );
			m.onExecuted = function( res, data )
			{
				ge( 'GuiContent' ).innerHTML = data;
				
				//
				
				// Reinitialize!
				Friend.responsive.pageActive = ge( 'GuiContent' ).getElementsByClassName( 'Responsive-Page' )[0];
				Friend.responsive.reinit();
			}
			m.execute( action[1] );
		}
	}
	
	// Default mode
	
	else
	{
		var sectPart = module.toLowerCase() + '_' + section.toLowerCase() + ( child ? '_' + child.toLowerCase() : '' );
		
		var f = new File( 'Progdir:Templates/' + sectPart + '.html' );
		f.onLoad = function( data )
		{
			ge( 'GuiContent' ).innerHTML = data;
		
			// Temporary until search is fixed for users ...
		
			if( section.toLowerCase() == 'users' || section.toLowerCase() == 'workgroups' ) 
			{
				//UsersSettings( 'maxlimit', 99999 );
			
				UsersSettings( 'reset', true );
			}
		
			Sections[ sectPart ]();
		
			// Reinitialize!
			Friend.responsive.pageActive = ge( 'GuiContent' ).getElementsByClassName( 'Responsive-Page' )[0];
			Friend.responsive.reinit();
		}
		f.load();
	}
}

var Sections = {
	// Let's do the server configuration, eh?
	server_configuration()
	{
		var m = new Module( 'system' );
		m.onExecuted = function( e, d )
		{
			if( e != 'ok' )
			{
				ge( 'ServerConfiguration' ).innerHTML = '<h2>Failed to load config</h2>';
				return;
			}
			var cfg = null;
			try
			{
				cfg = JSON.parse( d );
			}
			catch( e )
			{
				ge( 'ServerConfiguration' ).innerHTML = '<h2>Failed to parse config</h2>';
				return;
			}
			var str = '';
			
			for( var a in cfg )
			{
				str += FieldToInput( a, cfg[a] );
			}
			
			ge( 'ServerConfiguration' ).innerHTML = str;
		}
		m.execute( 'getconfiginijson', { authid: Application.authId } );
	},
	system_permissions()
	{
		var m = new Module( 'system' );
		m.onExecuted = function( e, d )
		{
			if( e == 'ok' )
			{
				try
				{
					d = JSON.parse( d );
				}
				catch( e ) 
				{
					
				}
			}
			
			if( ShowLog ) console.log( 'system_permissions() ', { e:e, d:d } );
		}
		m.execute( 'getsystempermissions', { authid: Application.authId } );
	},
	user_edit( id )
	{
	}
}



function Toggle( _this, callback, on )
{
	if( callback )
	{
		if( ShowLog ) console.log( _this.className );
		if( _this.className.indexOf( 'fa-toggle-off' ) >= 0 )
		{
			_this.className = _this.className.split( ' fa-toggle-off' ).join( '' ) + ' fa-toggle-on';
		
			callback( true );
			
			return;
		}
		else if( _this.className.indexOf( 'fa-toggle-on' ) >= 0 )
		{
			_this.className = _this.className.split( ' fa-toggle-on' ).join( '' ) + ' fa-toggle-off';
		
			callback( false );
			
			return;
		}
	}
	
	// If nothing is set, set default based on ( on | off ) preset
	
	if( _this.className.indexOf( 'fa-toggle-on' ) < 0 || _this.className.indexOf( 'fa-toggle-off' ) < 0 )
	{
		_this.className = _this.className.split( ' fa-toggle-on' ).join( '' ).split( ' fa-toggle-off' ).join( '' ) + ( on ? ' fa-toggle-on' : ' fa-toggle-off' );
	}
}

function Expand( _this, level, on )
{
	var pnt = _this.parentNode;
	
	if( level && level > 1 )
	{
		pnt = _this;
		
		for( var i = 0; i < level; i++ )
		{
			if( pnt.parentNode )
			{
				pnt = pnt.parentNode;
			}
		}
	}
	
	if( _this.className.indexOf( 'fa-chevron-right' ) >= 0 )
	{
		_this.className = _this.className.split( ' fa-chevron-right' ).join( '' ) + ' fa-chevron-down';
		
		pnt.className = pnt.className.split( ' collapse' ).join( '' );
	}
	else if( _this.className.indexOf( 'fa-chevron-down' ) >= 0 )
	{
		_this.className = _this.className.split( ' fa-chevron-down' ).join( '' ) + ' fa-chevron-right';
		
		pnt.className = pnt.className.split( ' collapse' ).join( '' ) + ' collapse';
	}
	
	// If nothing is set, set default based on ( on | off ) preset
	
	if( _this.className.indexOf( 'fa-chevron-right' ) < 0 && _this.className.indexOf( 'fa-chevron-down' ) < 0 )
	{
		_this.className = _this.className.split( ' fa-chevron-right' ).join( '' ).split( ' fa-chevron-down' ).join( '' ) + ( on ? ' fa-chevron-down' : ' fa-chevron-right' );
		
		pnt.className = pnt.className.split( ' collapse' ).join( '' ) + ( on ? '' : ' collapse' );
	}
}

function CustomDateTime( unix )
{
	if( !unix ) return 0;
	
	var curr = jsdate( 'Y-M-j-H-i' ).split( '-' );
	var date = jsdate( 'Y-M-j-H-i', str_pad( unix, 13, 'STR_PAD_RIGHT' ) ).split( '-' );
	
	// TODO: Add i18n translation ...
	
	if( curr && date )
	{
		// Year
		
		if( date[0] != curr[0] )
		{
			return ( date[1]+' '+date[0] );
		}
		
		// Month || Day
		
		if( date[1] != curr[1] || date[2] != curr[2] )
		{
			return ( date[2]+' '+date[1] );
		}
		
		// Day
		
		if( date[2] == curr[2] )
		{
			return ( date[3]+':'+date[4] );
		}
	}
	
	return 0;
}

function FieldToInput( key, data )
{
	var lkey = '';
	var lupper = true;
	for( var a = 0; a < key.length; a++ )
	{
		if( key[a] == '_' || key[a] == '-' )
		{
			lkey += ' ';
			lupper = true;
			continue;
		}
		if( lupper )
		{
			lkey += key[a].toUpperCase();
			lupper = false;
		}
		else
		{
			lkey += key[a];
		}
	}

	var str = '<div class="HRow">';
	str += '<div class="HContent20 FloatLeft Ellipsis Padding">' + lkey + ':</div>';
	str += '<div class="HContent80 FloatLeft Ellipsis Padding">';
	if( parseFloat( data ) )
	{
		str += '<input type="number" class="FullWidth" value="' + data + '"/>';
	}
	else if( data.substr )
	{
		if( data.length > 64 )
		{
			str += '<textarea class="FullWidth">' + data + '</textarea>';
		}
		else
		{
			str += '<input class="FullWidth" type="text" value="' + data + '"/>';
		}
	}
	str += '</div>';
	str += '</div>';
	return str;
}

function FormatBytes( bytes, decimals = 2, units = 1 ) 
{
    if ( bytes == 0 ) return ( '' + ( units ? '0B' : '' ) );
	
	// Using the same function that is used for fileInfo
	//var humanFS = Friend.Utilities.humanFileSize( bytes );
	var humanFS = HumanFileSize( bytes );
	
	if( humanFS )
	{
		var size = humanFS.split( ' ' )[0];
		var unit = humanFS.split( ' ' ).pop();
		
		//console.log( 'humanFS: ' + humanFS );
		//console.log( 'size: ' + size );
		//console.log( 'unit: ' + unit );
		
		if( units === 2 ) return unit;
		
		// Decimals are set to fixed = 1 ...
		
		return ( !units ? size : ( size + unit ) );
	}
	
	return ( !units ? '' : '0B' );
	
	// Old method ...
	
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = [ 'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ];
	
    const i = Math.floor( Math.log( bytes ) / Math.log( k ) );
	
	if( units === 2 ) return sizes[i];
	
    return parseFloat( ( bytes / Math.pow( k, i ) ).toFixed( dm ) ) + ( units ? ( ' ' + sizes[i] ) : '' );
}

// Couldn't include the function Friend.Utilities.humanFileSize() from interfaces/web_desktop/js/utils/utilities.js it wasn't enabled in the Application API so copied it, if changed, change also here ...

// TODO: look at this function why for example 500MB becomes 524.3MB

function HumanFileSize( bytes, si )
{
	if( typeof( si ) == 'undefined' || si !== false ) si = true;
	
    var thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
}

function CheckScroll( ele )
{
	if( !ele ) return;
	
	if( ShowLog ) console.log( ele.clientHeight + ' ... '  );
	
	ele.style.border = '1px solid blue';
	
	if( ( ele.scrollHeight - ele.clientHeight ) > 0 )
	{
		//console.log( ele.scrollTop + ' / ' + ( ele.scrollHeight - ele.clientHeight ) + ' * ' + 100 );
		
		var pos = Math.round( ele.scrollTop / ( ele.scrollHeight - ele.clientHeight ) * 100 );
		
		// Outputs prosentage
		
		return pos;
	}
}

function CheckWindowSize()
{
	var ele = document.body;
	
	//ele.style.border = '1px solid blue';
	
	Application.WindowSize = {
		width  : ele.clientWidth,
		height : ele.clientHeight
	};
	
	//console.log( '[w]: ' + Application.WindowSize.width + ' x [h]: ' + Application.WindowSize.height );
	
	CheckUserlistSize();
}

function initTest()
{
	
	// Permission testing
	
	var args = [ 
		// 0
		{ 
			type     : 'read', 
			context  : 'application', 
			authid   : Application.authId,
			data     : { permission : [ 'PERM_USER_GLOBAL', 'PERM_USER_WORKGROUP' ] } 
		},
		// 1
		{ 
			type     : 'read',
			context  : 'application', 
			authid   : Application.authId,
			data     : { permission : 'PERM_USER_GLOBAL' } 
		},
		// 2
		{ 
			type     : 'read',
			context  : 'application', 
			authid   : Application.authId,
			data     : { permission : 'PERM_USER_WORKGROUP' } 
		}, 
		// 3
		{ 
			type     : 'read', 
			context  : 'application', 
			authid   : Application.authId, 
		}, 
		// 4
		{ 
			type     : 'read', 
			context  : 'application', 
			authid   : Application.authId,
			object   : 'user',
			objectid : 21
		}, 
		// 5
		{ 
			type     : 'read', 
			context  : 'application', 
			authid   : Application.authId,
			object   : 'workgroup',
			objectid : 2000
		},
		// 6
		{ 
			type     : 'read', 
			context  : 'application', 
			name     : 'Users' 
		},
		// 7
		{ 
			type        : 'read', 
			context     : 'application', 
			authid      : Application.authId,
			data        : { permission : [ 'PERM_WORKGROUP_GLOBAL', 'PERM_WORKGROUP_WORKGROUP' ] },
			listdetails : 'workgroups' 
		},
		// 8
		{ 
			type        : 'read', 
			context     : 'application', 
			authid      : Application.authId,
			data        : { permission : [ 'PERM_WORKGROUP_GLOBAL', 'PERM_WORKGROUP_WORKGROUP' ] },
			object      : 'workgroup', 
			objectid    : 26, 
			listdetails : 'workgroup' 
		}
	];
	
	for( var i in args )
	{
		var m = new Module( 'system' );
		m.i = i;
		m.onExecuted = function( e, d )
		{
			if( d )
			{
				try
				{
					d = JSON.parse( d );
				}
				catch( e ){  }
			}
		
			if( ShowLog ) console.log( 'initTest('+this.i+') ' + "\r\n" + JSON.stringify( args[this.i] ) + "\r\n", { e:e, result:d } );
		}
		m.execute( 'permissions', args[i] );
	}
	
}

/* --- Global Files Event -------------------------------------------------------- */

// Check Global Keys
function checkKeys( e )
{
	if ( !e ) e = window.event;
	var targ = e.srcElement ? e.srcElement : e.target;
	var keycode = e.which ? e.which : e.keyCode;
	if( Application.closeAllEditModes )
	{
		Application.closeAllEditModes( { keycode : keycode } );
	}
}

// Check Global Cliks
function checkClicks( e )
{
	if ( !e ) e = window.event;
	var targ = ( e.srcElement ? e.srcElement : e.target );
	if( Application.closeAllEditModes )
	{
		Application.closeAllEditModes( { targ : targ } );
	}
	//if( ge( 'EditMode' ) )
	//{
	//	if( targ.id != 'EditMode' && targ.tagName != 'HTML' && targ.tagName != 'BODY' )
	//	{
	//		closeEditMode();
	//	}
	//}
}

// Assign Global Listeners
if ( window.addEventListener )
{
	window.addEventListener ( 'keydown', checkKeys );
	window.addEventListener ( 'mousedown', checkClicks );
}
else 
{
	window.attachEvent ( 'onkeydown', checkKeys );
	window.attachEvent ( 'onmousedown', checkClicks );
}

