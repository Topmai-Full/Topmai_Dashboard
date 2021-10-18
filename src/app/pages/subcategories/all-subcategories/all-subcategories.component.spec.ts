import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSubcategoriesComponent } from './all-subcategories.component';

describe('AllSubcategoriesComponent', () => {
  let component: AllSubcategoriesComponent;
  let fixture: ComponentFixture<AllSubcategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllSubcategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllSubcategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
