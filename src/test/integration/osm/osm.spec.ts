describe('Testing the transfers', () => {
  let authService: AuthService;
  let transferApiService: TransferApiService;
  let paymentApiService: PaymentApiService;

  beforeAll(done => {
    jest.setTimeout(100000);

    TestBed.configureTestingModule({
      providers: [{ provide: PAYCAP_PLATFORM_SERVICE, useClass: MockPlatformService }],
      imports: [
        AuthenticationModule.forRoot(),
        StoreModule.forRoot(reducer),
        EffectsModule.forRoot([]),
        TransfersModule,
        PaymentsModule
      ]
    });

    authService = TestBed.get(AuthService);
    transferApiService = TestBed.get(TransferApiService);
    paymentApiService = TestBed.get(PaymentApiService);
    // Here, we gat a token that we use throughout the whole tests
    authService.passwordLogin(fixtures.username, fixtures.password).subscribe(res => {
      console.log('Auth result:', res);
      done();
    });
  });

  it('it should get an offer for a payment and accept it', done => {});
});
