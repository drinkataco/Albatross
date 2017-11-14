from django import forms


class LoginForm(forms.Form):
    """
        Login form Definition
    """
    username = forms.CharField(label='Email',
                               max_length=100,
                               required=True)
    password = forms.CharField(label='Password',
                               max_length=1000,
                               required=True,
                               widget=forms.PasswordInput())
    # Contains redirect info
    next_page = forms.CharField(required=True,
                                widget=forms.HiddenInput())
