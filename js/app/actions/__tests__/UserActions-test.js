jest.dontMock( "../../constants/KanbanerConstants" );
jest.dontMock( "../../resources/GithubResource" );
jest.dontMock( "../UserActions" );
jest.dontMock( "../LoaderActions" );
jest.dontMock( "q" );
jest.dontMock( "btoa" );
jest.dontMock( "keymirror" );

describe( "UserActions", function() {
  var
    $,
    Q,
    KanbanerDispatcher,
    UserActions,
    KanbanerConstants = require( "../../constants/KanbanerConstants" ),
    ActionTypes = KanbanerConstants.ActionTypes;

  beforeEach(function() {
    Q = require( "q" );
    $ = require( "jquery" );
    KanbanerDispatcher = require( "../../dispatcher/KanbanerDispatcher" );
    UserActions = require( "../UserActions" );
  });

  it( "Send authentication success", function() {
    $.ajax = jest.genMockFunction();

    $.ajax.mockReturnValue( Q({
      token: "sometokenvalue",
      user: {
        login: "Zapix",
        id: 31337
      }
    }) );

    UserActions.sendAuthCredentials( "Zapix", "123123" )
      .then(function() {
        var
          callCount;

        expect( $.ajax ).toBeCalled();

        expect( KanbanerDispatcher.handleViewAction ).toBeCalled();

        callCount = KanbanerDispatcher.handleViewAction.mock.calls.filter(
          function(call) {
            return call[0].type == ActionTypes.USER_LOGIN_SUCCESS;
          }
        );

        expect( callCount.length ).toEqual( 1 );

      });
  });

  it( "Send authentication fail", function() {
    $.ajax = jest.genMockFunction();

    $.ajax.mockReturnValue( Q.reject("Failed") );

    UserActions.sendAuthCredentials( "Zapix", "123123" )
      .then(function() {
        var
          callCount;

        expect( $.ajax ).toBeCalled();

        expect( KanbanerDispatcher.handleViewAction ).toBeCalled();

        callCount = KanbanerDispatcher.handleViewAction.mock.calls.filter(
          function(call) {
            return call[0].type == ActionTypes.USER_LOGIN_FAIL;
          }
        );


        expect( callCount.length ).toEqual( 1 );
      });
  });

  it( "Send logout", function() {
    UserActions.logoutUser()
      .then(function() {
        var
          callValue;

        expect( KanbanerDispatcher.handleViewAction ).toBeCalled();

        callValue = KanbanerDispatcher.handleViewAction.mock.calls[0][0];

        expect( callValue.type ).toEqual( ActionTypes.USER_LOGOUT );
      });

  });
});