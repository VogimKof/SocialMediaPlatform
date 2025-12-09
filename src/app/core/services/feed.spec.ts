import { TestBed } from '@angular/core/testing';

import { FeedService } from './feed.service';

describe('Feed', () => {
  let service: FeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
