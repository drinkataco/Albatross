from django.test import TestCase


class ExampleTests(TestCase):

    def test_was_published_recently_with_future_question(self):
        self.assertEquals(False, True)
