import React from 'react';

const UpdateUserPasswordPage = () => {
  return (
    <>
      <div className="mt-5 mb-20 p-4 md:p-7 mx-auto rounded bg-white max-w-[580px]">
        <form>
          <h2 className="mb-5 text-2xl font-semibold">Update Password</h2>

          <div className="mb-4">
            <label className="block mb-1"> Current Password </label>
            <input
              className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
              type="password"
              placeholder="Type your password"
              minLength={6}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1"> New Password </label>
            <input
              className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
              type="password"
              placeholder="Type your password"
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="my-2 px-4 py-2 text-center w-full inline-block text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            Update
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdateUserPasswordPage;
