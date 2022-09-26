import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { AnchorButton, H1, Icon, IconSize } from '@blueprintjs/core';
import Link from 'next/link';

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
  return (
    <Disclosure as="nav">
      {({ open }) => (
        <>
          <header className="px-2 md:px-4 xl:px-8 border-bBorder border-b-2">
            <div className="relative flex h-16 items-center justify-between">
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
                      <a>
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
                      </a>
                    </Link>
                  </div>
                  <div className="hidden lg:block">
                    <Link href="/">
                      <a>
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
                      </a>
                    </Link>
                  </div>
                </div>
                <div className="hidden md:ml-5 lg:ml-10 md:block">
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
                            href="#"
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-md text-gray-700',
                            )}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
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
  );
}
