import React, { Fragment, useEffect, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import {
  AnchorButton,
  Button,
  ButtonGroup,
  Card,
  Classes,
  Elevation,
  H1,
  H2,
  H3,
  Icon,
  IconSize,
  InputGroup,
  Intent,
  Overlay,
  Tab,
  Tabs,
} from '@blueprintjs/core';
import Link from 'next/link';
import useAuth from '@cm/pwa/state/useAuth';

export function useForm(initialValues?: Record<string, any>) {
  const [values, setValues] = useState(initialValues || {});

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  };

  return {
    values,
    onChange,
  };
}

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};
const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Portfolio', href: '#', current: false },
  { name: 'News', href: '#', current: false },
  { name: 'Marketcap', href: '#', current: false },
  // { name: 'Calendar', href: '#', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Header() {
  const [tab, setTab] = useState<'login' | 'signUp'>('login');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { auth, login, logout, register } = useAuth();

  useEffect(() => {
    if (auth != undefined) {
      setIsOpen(false);
    }
  }, [auth]);

  return (
    <>
      <Disclosure as="nav">
        {({ open }) => (
          <>
            <header className="px-2 md:px-4 xl:px-8 border-bBorder border-b">
              <div className="relative flex h-20 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <Icon icon="cross" size={IconSize.STANDARD} />
                    ) : (
                      <Icon icon="menu" size={IconSize.STANDARD} />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <div className="block flex lg:hidden">
                      <Link href="/">
                        <img
                          className="inline-block relative bottom-[5px]"
                          width="51.45"
                          height="32"
                          src="logo-white.svg"
                          alt="CoinMonitor"
                        />
                        <H1 className="text-white inline-block mb-0 ml-2 relative top-[2px]">
                          CoinMonitor
                        </H1>
                      </Link>
                    </div>
                    <div className="hidden lg:block">
                      <Link href="/">
                        <img
                          className="inline-block relative bottom-[5px]"
                          width="51.45"
                          height="32"
                          src="logo-white.svg"
                          alt="CoinMonitor"
                        />
                        <H1 className="text-white inline-block mb-0 ml-2 relative top-[2px]">
                          CoinMonitor
                        </H1>
                      </Link>
                    </div>
                  </div>
                  <div className="hidden mt-0.5 md:ml-5 lg:ml-10 md:block">
                    <div className="flex md:space-x-2 lg:space-x-6">
                      {navigation.map((item) => (
                        <AnchorButton
                          key={item.name}
                          href={item.href}
                          minimal
                          large
                          active={item.current}
                          aria-current={item.current ? 'page' : undefined}
                          text={item.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0">
                  {auth ? (
                    <>
                      <button
                        type="button"
                        className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        <span className="sr-only">View notifications</span>
                        <Icon icon="notifications" size={IconSize.STANDARD} />
                      </button>

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="flex rounded-full bg-gray-800 text-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="sr-only">Open user menu</span>
                            <img
                              className="h-8 w-8 rounded-full"
                              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                              alt=""
                            />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="#"
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-md text-gray-700',
                                  )}
                                >
                                  Your Profile
                                </a>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="#"
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-md text-gray-700',
                                  )}
                                >
                                  Settings
                                </a>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-md text-gray-700',
                                  )}
                                  onClick={logout}
                                >
                                  Sign out
                                </a>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </>
                  ) : (
                    <ButtonGroup>
                      <Button
                        large
                        onClick={() => {
                          setTab('login');
                          setIsOpen(true);
                        }}
                      >
                        Login
                      </Button>
                      <Button
                        large
                        intent={Intent.SUCCESS}
                        onClick={() => {
                          setTab('signUp');
                          setIsOpen(true);
                        }}
                      >
                        SignUp
                      </Button>
                    </ButtonGroup>
                  )}
                </div>
              </div>
            </header>

            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-2 pt-2 pb-3">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block px-3 py-2 rounded-md text-base font-medium',
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <Overlay
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
        className={Classes.OVERLAY_SCROLL_CONTAINER}
        usePortal
        canOutsideClickClose
        canEscapeKeyClose
        hasBackdrop
        autoFocus
      >
        <Card elevation={Elevation.THREE} className="w-4/5 max-w-sm">
          <Tabs
            id="LoginSignUp"
            onChange={(loginTab: 'login' | 'signUp') => setTab(loginTab)}
            selectedTabId={tab}
            large={true}
          >
            <Tab
              id="login"
              // disabled={loginTab}
              title={<H2>Login</H2>}
              panel={<Login login={login} />}
            />
            <Tab
              id="signUp"
              // disabled={loginTab}
              title={<H2>Sign Up</H2>}
              panel={<Register register={register} />}
            />
          </Tabs>
          <Button large={true} fill={true} onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </Card>
      </Overlay>
    </>
  );
}

export function Login({ login }) {
  const { values, onChange } = useForm({
    email: 'user@mail.de',
    password: '',
  });
  const [error, setError] = React.useState<any>(null);
  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await login(values.email, values.password);
          } catch (err) {
            setError(err);
          }
        }}
      >
        <H3 className="mt-10">E-Mail</H3>
        <InputGroup
          name="email"
          onChange={onChange}
          value={values.email}
          large
          fill
          leftIcon="envelope"
        />
        <H3 className="mt-7">Password</H3>
        <InputGroup
          autoComplete="new-password"
          type="password"
          name="password"
          onChange={onChange}
          value={values.password}
          large
          fill
          leftIcon="key"
        />
        {error && <div style={{ color: 'tomato' }}>{JSON.stringify(error, null, 2)}</div>}
        <Button large intent={Intent.SUCCESS} fill type="submit" className="mb-5 mt-10">
          Submit
        </Button>
      </form>
    </div>
  );
}

export function Register({ register }) {
  const { values, onChange } = useForm({
    email: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState<any>(null);

  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await register(values.email, values.username, values.password);
          } catch (err) {
            setError(err);
          }
        }}
      >
        <H3 className="mt-10">E-Mail</H3>
        <InputGroup
          name="email"
          onChange={onChange}
          value={values.email}
          large
          fill
          leftIcon="envelope"
        />
        <H3 className="mt-7">Username</H3>
        <InputGroup
          name="username"
          onChange={onChange}
          value={values.username}
          large
          fill
          leftIcon="chat"
        />
        <H3 className="mt-7">Password</H3>
        <InputGroup
          autoComplete="new-password"
          type="password"
          name="password"
          onChange={onChange}
          value={values.password}
          large
          fill
          leftIcon="key"
        />
        {error && <div style={{ color: 'tomato' }}>{JSON.stringify(error, null, 2)}</div>}
        <Button large intent={Intent.SUCCESS} fill type="submit" className="mb-5 mt-10">
          Submit
        </Button>
      </form>
    </div>
  );
}
