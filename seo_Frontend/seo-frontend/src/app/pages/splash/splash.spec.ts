import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Splash } from './splash';

describe('Splash', () => {
  let component: Splash;
  let fixture: ComponentFixture<Splash>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Splash],
    }).compileComponents();

    fixture = TestBed.createComponent(Splash);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
