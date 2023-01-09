import requests
import argparse


class User:
    def __init__(self, student_id: str, cookie: str):
        self.student_id = student_id
        self.cookie = cookie


def login(user_name: str, user_pwd: str) -> str:
    index_url = 'https://cas.paas.jmu.edu.cn/cas/login?service=http%3A%2F%2Fjwxt.jmu.edu.cn%2Fstudent%2Fsso%2Flogin'
    detect_url = 'https://cas.paas.jmu.edu.cn/cas/mfa/detect'
    login_url = 'https://cas.paas.jmu.edu.cn/cas/login?service=http://jwxt.jmu.edu.cn/student/sso/login'
    info_url = 'http://jwxt.jmu.edu.cn/student/for-std/student-info/'
    user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'

    # user_name = 'username'
    # user_pwd = 'password'

    index_res = requests.get(index_url)
    session = index_res.cookies['SESSION']

    detect_data = {
        'username': user_name,
        'password': user_pwd
    }
    detect_res = requests.post(url=detect_url,
                               data=detect_data,
                               headers={'cookie': f'SESSION={session}', 'user-agent': user_agent})

    mfa_state = detect_res.json()['data']['state']

    login_data = {
        'username': user_name,
        'password': user_pwd,
        'mfaState': mfa_state,
        'execution': 'e1s1',
        '_eventId': 'submit',
        'submit': 'Login1'
    }

    login_res = requests.post(url=login_url,
                              data=login_data,
                              headers={'cookie': f'SESSION={session}', 'user-agent': user_agent})

    try:
        verified_session = login_res.history[1].cookies['SESSION']  # cookie:SESSION
        verified_pstsid = login_res.history[1].cookies['__pstsid__']  # cookie:__pstsid__
        verified_cookie = f'SESSION={verified_session};__pstsid__={verified_pstsid}'
    except IndexError:
        return "请检查账号密码是否正确"

    info_res = requests.get(url=info_url,
                            headers={'cookie': verified_cookie, 'user-agent': user_agent},
                            allow_redirects=False)

    student_id = info_res.headers['location'].split(info_url)[1].split('/')[1]
    User(cookie=verified_cookie, student_id=student_id)
    return f'{verified_cookie},{student_id}'


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-u', type=str)
    parser.add_argument('-p', type=str)
    args = parser.parse_args()
    try:
        print(login(user_name=args.u, user_pwd=args.p))
    finally:
        exit(1)
